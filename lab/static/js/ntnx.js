var NtnxDashboard;
NtnxDashboard = {

    init: function ( config )
    {
        this.config = config;
        this.setupGridster();
        this.setUI();
        this.bindEvents();

        /* load the saved/default dashboard when the DOM is ready */
        $( document).ready( function() {

            NtnxDashboard.loadLayout();

        });

    },
    /* init */

    resetCell: function( cell )
    {
        $( '#' + cell ).html( '<span class="gs-resize-handle gs-resize-handle-both"></span>' );
    },

    physicalInfo: function( cvmAddress, username, password )
    {

	    physicalData = $.ajax({
		    url: '/ajax/physical-info',
		    type: 'POST',
		    dataType: 'json',
		    data: { _cvmAddress: cvmAddress, _username: username, _password: password },
	    });

        physicalData.success( function(data) {

            hostSerials = '';
            $.each( data['entities'], function() {
                hostSerials = hostSerials + 'S/N&nbsp;' + this.serial + '<br>';
            });

            NtnxDashboard.resetCell( 'hosts' );
                $( '#hosts' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">' + data['metadata']['count'] + ' Hosts</div>' );
                $( '#hosts' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">' + hostSerials + '</div>' );
            });

        physicalData.fail(function ( jqXHR, textStatus, errorThrown )
        {
            console.log('error getting physical info');
        });
    },

    vmInfo: function( cvmAddress, username, password )
    {

        vmData = $.ajax({
            url: '/ajax/vm-info',
            type: 'POST',
            dataType: 'json',
            data: { _cvmAddress: cvmAddress, _username: username, _password: password },
        });

        vmData.success( function(data) {
            NtnxDashboard.resetCell( 'blocks' );
            $( '#blocks' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Cantidad de VM(s)</div><div>' + data['metadata']['count'] + '</div><div></div>');
        });

        vmData.fail(function ( jqXHR, textStatus, errorThrown )
        {
            console.log('error getting vm info')
        });
    },

    containerInfo: function( cvmAddress, username, password )
    {

        containerData = $.ajax({
            url: '/ajax/container-info',
            type: 'POST',
            dataType: 'json',
            data: { _cvmAddress: cvmAddress, _username: username, _password: password },
        });

        containerData.success( function(data) {
            NtnxDashboard.resetCell( 'containers' );
            $( '#containers' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Numero de Contenedores(s)</div><div>' + data['metadata']['count'] + '</div><div></div>');
        });

        containerData.fail(function ( jqXHR, textStatus, errorThrown )
        {
            console.log('error getting container info')
        });
    },

    clusterInfo: function( cvmAddress, username, password )
    {

        clusterInfo = $.ajax({
            url: '/ajax/cluster-info',
            type: 'POST',
	    dataType: 'json',
            data: { _cvmAddress: cvmAddress, _username: username, _password: password },
        });

        clusterInfo.success( function(data) {

		cluster_entity = data['entities'][0];

            NtnxDashboard.resetCell( 'blocks' );

      //      $( '#blocks' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">AOS</div><div>');
      //      $( '#blocks' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + cluster_entity['status']['resources']['config']['build']['version'] + '</div><div></div>' );

            NtnxDashboard.resetCell( 'clusterSummary' );
            $( '#clusterSummary' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Cluster</div><div>');
            $( '#clusterSummary' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + cluster_entity['status']['name'] + '</div><div></div>' );
            $( '#clusterSummary' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">AOS</div><div>');
            $( '#clusterSummary' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + cluster_entity['status']['resources']['config']['build']['version'] + '</div><div></div>' );

          //  NtnxDashboard.resetCell( 'blocks' );
          //  $( '#blocks' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hypervisors</div>' );
          //  $( '#blocks' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">' );

          //  ahv = false;
          //  vmware = false;
          //  hyperv = false;
          //  $( cluster_entity['status']['resources']['nodes']['hypervisor_server_list'] ).each( function( index, item ) {
          //      switch( item['type'] )
          //      {
          //          case 'AHV':
          //              if( ahv != true ) {
          //                  $( '#blocks' ).append( 'AHV<br>' );
          //              }
          //              ahv = true;
          //              break;
          //          case 'VMware':
          //              $( '#blocks' ).append( 'ESXi<br>' );
          //              break;
          //          case 'Hyper-V':
          //              $( '#blocks' ).append( 'Hyper-V<br>' );
          //              break;
          //      }
          //  });

          //  $( '#blocks' ).append( '</div' );

        });

        clusterInfo.fail(function ( jqXHR, textStatus, errorThrown )
        {
            NtnxDashboard.resetCell( 'clusterSummary' );
            $( '#clusterSummary' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Nombre del Cluster</div><div>' + textStatus + '</div><div></div>');
        });

    },

    storagePerformance: function( cvmAddress, username, password ) {

        /* AJAX call to get some container stats */
        request = $.ajax({
            url: '/ajax/storage-performance',
            type: 'POST',
            dataType: 'json',
            data: { _cvmAddress: cvmAddress, _username: username, _password: password },
        });

        request.success( function(data) {

            var plot1 = $.jqplot ('controllerIOPS', [ data['statsSpecificResponses'][0]['values'] ], {
                title: 'Latencia Promedio del I/O (Ultimas 4 Horas)',
                animate: true,
                axesDefaults: {
                    labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
                    tickOptions: {
                        showMark: false,
                        show: true,
                    },
                    showTickMarks: false,
                    showTicks: false
                },
                seriesDefaults: {
                    rendererOptions: {
                        smooth: false
                    },
                    showMarker: false,
                    fill: true,
                    fillAndStroke: true,
                    color: '#b4d194',
                    fillColor: '#b4d194',
                    fillAlpha: '0.3',
                    shadow: false,
                    shadowAlpha: 0.1,
                },
                axes: {
                    xaxis: {
                        min: 5,
                        max: 120,
                        tickOptions: {
                            showGridline: true,
                        }
                    },
                    yaxis: {
                        tickOptions: {
                            showGridline: false,
                        }
                    }
                }
            });

            NtnxDashboard.resetCell( 'containers' );
            $( '#containers' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Container(s)</div><div>' + data.containerCount + '</div><div></div>');

        });

        request.fail(function ( jqXHR, textStatus, errorThrown )
        {
            console.log('error getting data for performance chart');
        });

    },

    replicationInfo: function( cvmAddress, username, password )
    {

        replicationData = $.ajax({
            url: '/ajax/replication-list',
            type: 'POST',
            dataType: 'json',
            data: { _cvmAddress: cvmAddress, _username: username, _password: password },
        });


        replicationData.success( function(data) {
          pd_entity = data['replication_links'][0];
            NtnxDashboard.resetCell( 'nosVersion' );
            $( '#nosVersion' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hora de Finalizacion Ultima Replica Exitosa</div><div>');
            $( '#nosVersion' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + new Date(pd_entity['last_replication_end_time_in_usecs']/1000) + '</div><div></div>' );
          //  $( '#replicationinfo' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hora</div><div>');
            $( '#nosVersion' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Cantidad de Datos Replicados</div><div>');
            $( '#nosVersion' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + pd_entity['current_replicating_snapshot_total_bytes']/1000000 + ' MB</div><div></div>' );

            NtnxDashboard.resetCell( 'misc1' );
            $( '#misc1' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Tiempo Transcurrido Ultima Replica</div><div>');
            $( '#misc1' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + (pd_entity['last_replication_end_time_in_usecs']- pd_entity['last_replication_start_time_in_usecs'])/1000000 + ' seg </div><div></div>' );

            NtnxDashboard.resetCell( 'misc2' );
            $( '#misc2' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hora Proxima Replica</div><div>');
            $( '#misc2' ).append( '<div style="color: #065535; font-size: 35%; padding: 10px 0 0 0;">' + new Date(data['next_snapshot_time_usecs']/1000) + '</div><div></div>' );

        });

        replicationData.fail(function ( jqXHR, textStatus, errorThrown )
        {
            console.log('error getting image info')
        });
    },
    // removeGraph: function( token ) {
    //     var gridster = $( '.gridster ul' ).gridster().data( 'gridster' );
    //     var element = $( '#bigGraph' );
    //     gridster.remove_widget( element );
    // },

    clusterStats: function( cvmAddress, username, password )
    {

        clusterData = $.ajax({
            url: '/ajax/cluster-stats',
            type: 'POST',
            dataType: 'json',
            data: { _cvmAddress: cvmAddress, _username: username, _password: password },
        });


        clusterData.success( function(data) {

            NtnxDashboard.resetCell( 'vmInfo' );
            $( '#vmInfo' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 35%; padding: 10px 0 0 0;">Utilizacion de CPU del Cluster</div><div>');
            $( '#vmInfo' ).append( '<div style="color: #065535; font-size: 45%; padding: 10px 0 0 0;">' + data['stats']['hypervisor_cpu_usage_ppm']/1000000*100  + ' % </div><div></div>' );
          //  $( '#replicationinfo' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hora</div><div>');
            $( '#vmInfo' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 35%; padding: 10px 0 0 0;">Utilizacion de RAM del Cluster</div><div>');
            $( '#vmInfo' ).append( '<div style="color: #065535; font-size: 45%; padding: 10px 0 0 0;">' + data['stats']['hypervisor_memory_usage_ppm']/1000000*100  + ' % </div><div></div>' );

            NtnxDashboard.resetCell( 'hints' );
            $( '#hints' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 45%; padding: 10px 0 0 0;">IOPS Lectura del Cluster</div><div>');
            $( '#hints' ).append( '<div style="color: #065535; font-size: 55%; padding: 10px 0 0 0;">' + data['stats']['num_read_iops']  + '</div><div></div>' );
          //  $( '#replicationinfo' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hora</div><div>');
            $( '#hints' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 45%; padding: 10px 0 0 0;">IOPS Escritura del Cluster</div><div>');
            $( '#hints' ).append( '<div style="color: #065535; font-size: 55%; padding: 10px 0 0 0;">' + data['stats']['num_write_iops']  + '</div><div></div>' );
        });

        clusterData.fail(function ( jqXHR, textStatus, errorThrown )
        {
            console.log('error getting image info')
        });
    },



    loadLayout: function()
    {
        request = $.ajax({
            url: '/ajax/load-layout',
            type: 'POST',
            dataType: 'json',
            data: {},
        });

        var cvmAddress = $( '#cvmAddress' ).val();
        var username = $( '#username' ).val();
        var password = $( '#password' ).val();

        request.success( function( data ) {

            var gridster = $( '.gridster ul' ).gridster().data( 'gridster' );

            serialization = Gridster.sort_by_row_and_col_asc(data);

            $.each( data, function() {
                gridster.add_widget('<li id="' + this.id + '" />', this.size_x, this.size_y, this.col, this.row);
            });

            /* add the chart markup to the largest containers */
            $( 'li#footerWidget' ).addClass( 'panel' ).append( '<div class="panel-body"><div id="controllerIOPS" style="height: 150px; width: 1000px; text-align: center;"></div></div>' );

            NtnxDashboard.resetCell( 'bigGraph' );
            $( '#bigGraph' ).addClass( 'info_hilite' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Hey ...</div><div>Ingresa los datos de tu cluster, luego dar click en el boton Go ...</div>');
            $( '#hints' ).addClass( 'info_hilite' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Also ...</div><div>Selecciona &amp; Arrastra<br>Los Cuadros</div>');

        });

        request.fail(function ( jqXHR, textStatus, errorThrown )
        {
            /* Display an error message */
            alert( 'Unfortunately an error occurred while processing the request.  Status: ' + textStatus + ', Error Thrown: ' + errorThrown );
        });
    },

	setupGridster: function ()
	{
		$( function ()
		{

			var gridster = $( '.gridster ul' ).gridster( {
				widget_margins: [ 10, 10 ],
				widget_base_dimensions: [ 170, 170 ],
				max_cols: 10,
				autogrow_cols: true,
				resize: {
					enabled: true
                },
                serialize_params: function ($w, wgd) {

                    return {
                        /* add element ID to data*/
                        id: $w.attr('id'),
                        /* defaults */
                        col: wgd.col,
                        row: wgd.row,
                        size_x: wgd.size_x,
                        size_y: wgd.size_y
                    }

                }
			} ).data( 'gridster' );

		} );
	},

    setUI: function ()
    {

        $( 'div.alert-success' ).delay( 3000 ).slideUp( 1000 );
        $( 'div.alert-info' ).delay( 3000 ).slideUp( 1000 );

        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        })

    },
    /* setUI */

    bindEvents: function()
    {

        var self = NtnxDashboard;

        $( '#goButton' ).on( 'click', function ( e ) {

            var cvmAddress = $( '#cvmAddress' ).val();
            var username = $( '#username' ).val();
            var password = $( '#password' ).val();

            if( ( cvmAddress == '' ) || ( username == '' ) || ( password == '' ) )
            {
                NtnxDashboard.resetCell( 'bigGraph' );
                $( '#bigGraph' ).addClass( 'info_error' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Awww ...</div><div>Did you forget to enter something?</div>');
            }
            else
            {
                NtnxDashboard.resetCell( 'bigGraph' );
                $( '#bigGraph' ).html( '<span class="gs-resize-handle gs-resize-handle-both"></span>' ).removeClass( 'info_hilite' ).removeClass( 'info_error' ).addClass( 'info_big' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Ok ...</div><div>Este es el reporte de tu cluster ...</div>');
    //            NtnxDashboard.resetCell( 'hints' );
    //            $( '#hints' ).html( '<span class="gs-resize-handle gs-resize-handle-both"></span>' ).addClass( 'info_hilite' ).append( '<div style="color: #6F787E; font-size: 25%; padding: 10px 0 0 0;">Also ...</div><div>Selecciona &amp; Arrastra<br>Los Cuadros</div>');

                NtnxDashboard.clusterInfo( cvmAddress, username, password );

                NtnxDashboard.physicalInfo( cvmAddress, username, password );
                NtnxDashboard.vmInfo( cvmAddress, username, password );
                NtnxDashboard.storagePerformance( cvmAddress, username, password );
                NtnxDashboard.containerInfo( cvmAddress, username, password );
                NtnxDashboard.replicationInfo( cvmAddress, username, password );
                NtnxDashboard.clusterStats( cvmAddress, username, password );
            }

            e.preventDefault();
        });

        $( '.defaultLayout' ).on( 'click', function( e ) {
            NtnxDashboard.restoreDefaultLayout( $( '#csrf_token' ).val() );
            e.preventDefault();
        });

        $( '.removeGraph' ).on( 'click', function( e ) {
            NtnxDashboard.removeGraph( $( '#csrf_token' ).val() );
            e.preventDefault();
        });

        $( '.containerStats' ).on( 'click', function( e ) {
            NtnxDashboard.containerInfo( $( '#csrf_token' ).val(), $( '#cvmAddress' ).val(), $( '#username' ).val(), $( '#password' ).val() );
            e.preventDefault();
        });

    },
    /* bindEvents */

};

NtnxDashboard.init({

});
