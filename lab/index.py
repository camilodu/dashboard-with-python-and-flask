from lab.forms import clusterForm

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint('index', __name__, url_prefix='/')

@bp.route('/')
def index():
    # make sure we are using the form that's been generated in forms.py
    form = clusterForm()
    return render_template('index.html', form=form)
