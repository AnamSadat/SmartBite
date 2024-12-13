from functools import wraps
from flask import request, jsonify
from ..libs.db import get_mysql_connection
from jwt.exceptions import ExpiredSignatureError, InvalidTokenError
import jwt
import os


def authenticate(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if token is None:
            return jsonify({"message": "Missing Authorization Header"}), 401
        try:
            decode_token = jwt.decode(token.split(' ')[1], os.getenv(
                "SECRET_KEY"), algorithms=["HS256"])
            id_user = decode_token['id']
            sql = get_mysql_connection()
            db = sql.cursor()
            query = "SELECT * FROM active_tokens WHERE user_id = %s"
            db.execute(query, (id_user,))
            results = db.fetchall()
            if not results:
                return jsonify({"message": "Invalid token or user not found"}), 401
            db.close()
            sql.close()
            request.user_id = id_user
        except ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 401
        except InvalidTokenError:
            return jsonify({"message": "Invalid token"}), 401
        except IndexError as err:
            return jsonify({"message": "Missing Authorization Header"}), 401

        return f(*args, **kwargs)
    return decorated
