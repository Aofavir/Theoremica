from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///geometry_theories.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this to a random secret key
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True  # Enable in production with HTTPS
app.config['REMEMBER_COOKIE_HTTPONLY'] = True
app.config['REMEMBER_COOKIE_DURATION'] = 86400  # 1 day in seconds
login_manager = LoginManager(app)

db = SQLAlchemy(app)


class GeometryTheory(db.Model):
    __tablename__ = 'geometry_theories'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    views = db.Column(db.Integer, default=0)

    images = db.relationship('Image', backref='theory', lazy=True)

    grade = db.relationship('Grade', backref='theory', lazy=True)
    topics = db.relationship('Topic', backref='theory', lazy=True)


class Image(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    theory_id = db.Column(db.Integer, db.ForeignKey('geometry_theories.id'), nullable=False)


class Grade(db.Model):
    __tablename__ = 'grades'

    id = db.Column(db.Integer, primary_key=True)
    grade = db.Column(db.String(255), nullable=False)
    theory_id = db.Column(db.Integer, db.ForeignKey('geometry_theories.id'), nullable=False)


class Topic(db.Model):
    __tablename__ = 'topics'

    id = db.Column(db.Integer, primary_key=True)
    topic = db.Column(db.String(255), nullable=False)
    theory_id = db.Column(db.Integer, db.ForeignKey('geometry_theories.id'), nullable=False)


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    surname = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(255), nullable=False)
    grade = db.Column(db.Integer, nullable=False)
    email = db.Column(db.String(255), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)

    def set_password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)


with app.app_context():
    db.create_all()


@app.route('/theories', methods=['GET'])
def get_theories():
    offset = request.args.get("offset")
    limit = request.args.get("limit")
    sort = request.args.get("sort")

    query = GeometryTheory.query
    if sort:
        # ascending - по возрастанию, descending - по убыванию
        direction = "asc"
        if ":" in sort:
            sort, direction = sort.split(":")
        query = query.order_by(
            getattr(GeometryTheory, sort).desc() if direction == "desc" else getattr(GeometryTheory, sort))
    if offset:
        query = query.offset(offset)
    if limit:
        query = query.limit(limit)
    theories = query.all()
    return jsonify([{
        'id': theory.id,
        'title': theory.title,
        'description': theory.description,
        'views': theory.views,
        'images': [{'id': img.id, 'filename': img.filename} for img in theory.images],
        'grade': [grade.grade for grade in theory.grade or []],
        'topics': [topic.topic for topic in theory.topics or []],
    } for theory in theories])


@app.route('/theories/<int:id>', methods=['GET'])
def get_theory(id):
    theory = GeometryTheory.query.get(id)
    if not theory:
        abort(404, description=f"Theory with ID {id} not found")

    return jsonify({
        'id': theory.id,
        'title': theory.title,
        'description': theory.description,
        'views': theory.views,
        'images': [{'id': img.id, 'filename': img.filename} for img in theory.images],
        'grade': [grade.grade for grade in theory.grade or []],
        'topics': [topic.topic for topic in theory.topics or []],
    })


@app.route('/theories/<int:id>/views', methods=['PUT'])
def update_views(id):
    theory = GeometryTheory.query.get(id)
    if not theory:
        abort(404, description=f"Theory with ID {id} not found")

    theory.views += 1
    db.session.commit()
    return jsonify({
        'message': 'View count updated',
        'views': theory.views
    })


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': error.description}), 404


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@app.route('/signup', methods=['POST'])
def signup():
    data = request.form
    surname = data.get('surname')
    first_name = data.get('first-name')
    grade = data.get('grade')
    email = data.get('email')
    password = data.get('password')
    repeat_password = data.get('repeat-password')
    is_admin = False
    if not first_name or not password or not surname or not repeat_password or not email:
        return jsonify({'message': 'Заполните все обязательные поля'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Эта почта уже принадлежит другому аккаунту'}), 400
    if password != repeat_password:
        return jsonify({'message': 'Пароли не совпадают'}), 400

    user = User(
        first_name=first_name,
        surname=surname,
        grade=grade,
        email=email,
        is_admin=is_admin
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    login_user(user, remember=True)
    return jsonify({'message': 'Аккаунт создан'})


@app.route('/login', methods=["POST"])
def login():
    data = request.form
    email = data.get('email')
    password = data.get('password')
    remember = data.get('remember', False)
    if not email or not password:
        return jsonify({'message': 'Заполните все поля'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'message': 'Неверные почта или пароль'}), 400

    login_user(user, remember=remember)

    return jsonify({'message': 'Успешная авторизация'})


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Успешный выход из аккаунта'})


if __name__ == '__main__':
    app.run(debug=True, port=5000, host='127.0.0.1')
