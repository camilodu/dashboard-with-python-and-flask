import os
import json
import base64
import sys
from datetime import datetime
from datetime import timedelta
import time

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from .util import apiclient

bp = Blueprint('ajax', __name__, url_prefix='/ajax')

"""
get the form POST data provided by the user
"""
def get_form():
    global form_data
    global cvmAddress
    global username
    global password
    form_data = request.form
    cvmAddress = form_data['_cvmAddress']
    username = form_data['_username']
    password = form_data['_password']

"""
load the default layout at app startup
"""
@bp.route('/load-layout',methods=['POST'])
def load_layout():
    site_root = os.path.realpath(os.path.dirname(__file__))
    layout_path = 'static/layouts'
    dashboard_file = 'dashboard.json'
    with open( f'{site_root}/{layout_path}/{dashboard_file}','r') as f:
        raw_json = json.loads(f.read())
        return base64.b64decode(raw_json['layout']).decode('utf-8')

"""
get some high level cluster info
"""
@bp.route('/cluster-info',methods=['POST'])
def cluster_info():
    # get the request's POST data
    get_form()
    client = apiclient.ApiClient('post', cvmAddress,'clusters/list','{"kind":"cluster"}',username,password)
    #print (client)
    results = client.get_info()
    return jsonify(results)

"""
get the cluster status e.g. % of cpu and RAM
"""
@bp.route('/cluster-stats',methods=['POST'])
def cluster_stats():
    # get the request's POST data
    get_form()
    client = apiclient.ApiClient('get',cvmAddress,f'cluster','',username,password,'v2.0')
    results = client.get_info()
    print (results)
    return jsonify(results)

"""
get the vm count
"""
@bp.route('/vm-info',methods=['GET','POST'])
def vm_info():
    # get the request's POST data
    get_form()
    client = apiclient.ApiClient('get', cvmAddress,'vms','',username,password,'v2.0')
    results = client.get_info()
    return jsonify(results)

"""
get the cluster's physical info e.g. # of hosts, host serial numbers
"""
@bp.route('/physical-info',methods=['POST'])
def physical_info():
    # get the request's POST data
    get_form()
    client = apiclient.ApiClient('get', cvmAddress,'hosts','',username,password,'v2.0')
    results = client.get_info()
    return jsonify(results)

"""
get the cluster's storage performance
"""
@bp.route('/storage-performance',methods=['POST'])
def storage_performance():
    # get the request's POST data
    get_form()

    # get the current time then substract 4 hours
    # this is used for the storage performance chart
    endTime = datetime.now()
    delta = timedelta(hours=-4)
    startTime = endTime + delta
    endTime = round(time.mktime(endTime.timetuple()) * 1000 * 1000)
    startTime = round(time.mktime(startTime.timetuple()) * 1000 * 1000)

    client = apiclient.ApiClient('get',cvmAddress,f'cluster/stats/?metrics=controller_avg_io_latency_usecs&startTimeInUsecs={startTime}&endTimeInUsecs={endTime}&intervalInSecs=30','',username,password,'v1','PrismGateway/services/rest')
    results = client.get_info()
    return jsonify(results)

"""
get the last replication_end_time_in_usecs e.g. # of remote sites
"""
@bp.route('/replication-list',methods=['POST'])
def replicationinfo():
    # get the request's POST data
    get_form()
    client = apiclient.ApiClient('get',cvmAddress,f'protection_domains/Linux-Replication','',username,password,'v2.0')
    results = client.get_info()
    #print (results)
    return jsonify(results)

"""
get the container info e.g. # of containers
"""
@bp.route('/container-info',methods=['POST'])
def containers():
    # get the request's POST data
    get_form()
    client = apiclient.ApiClient('get',cvmAddress,f'storage_containers','',username,password,'v2.0')
    results = client.get_info()
    return jsonify(results)
