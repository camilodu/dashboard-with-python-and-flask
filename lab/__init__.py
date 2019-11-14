import os

from flask import Flask
from flask_assets import Environment, Bundle

from .util import apiclient
from config import Config

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)

    assets = Environment(app)

    home_css = Bundle(
        'css/lib/reset.css',
        'css/lib/built-in.css',
        'css/lib/jquery-ui-custom.css',
        'css/lib/jq.gridster.css',
        'css/lib/jq.jqplot.css',
        'css/ntnx.css'
    )
    home_js = Bundle(
        'js/lib/jquery-2.1.3.min.js',
        'js/lib/classie.min.js',
        'js/lib/ntnx-bootstrap.min.js',
        'js/lib/modernizr.custom.min.js',
        'js/lib/jquery.jqplot.min.js',
        'js/lib/jqplot.logAxisRenderer.js',
        'js/lib/jqplot.categoryAxisRenderer.js',
        'js/lib/jqplot.canvasAxisLabelRenderer.js',
        'js/lib/jqplot.canvasTextRenderer.js',
        'js/lib/jquery.gridster.min.js',
        'js/ntnx.js'
    )

    assets.register('home_css',home_css)
    assets.register('home_js',home_js)

    app.config.from_object(Config)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    from . import index
    app.register_blueprint(index.bp)

    from . import ajax
    app.register_blueprint(ajax.bp)

    return app
