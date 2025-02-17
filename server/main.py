from flask import Flask, jsonify, request, abort
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///geometry_theories.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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


if __name__ == '__main__':
    app.run(debug=True)
