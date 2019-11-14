from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired

"""
The clusterForm class is used to identify the properties used when submitted cluster details
"""
class clusterForm(FlaskForm):
    cvmAddress = StringField('cvmAddress', validators=[DataRequired()])
    username = StringField('username', validators=[DataRequired()])
    password = PasswordField('password', validators=[DataRequired()])
    submit = SubmitField('Go!', id="goButton")
