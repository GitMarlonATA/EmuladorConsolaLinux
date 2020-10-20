
var sistema = {

            "maquinaActual":-1,
            "usuarioActual":-1,
            "maquina":[
                        {
                            "nombre":"maquina-1",
                            "ip": "192.168.0.1",
                            "grupo": [
                                       {"nombre": "anderson"},
                                       {"nombre":"brayan"},
                                       {"nombre":"marlon"},
                                       {"nombre":"esteban"},
                                       {"nombre": "mercadeo"},
                                       {"nombre":"tecnologia"}
        
                                    ],
                            "usuario":[
                                
                                        {"nombre":"anderson","grupo":4},
                                        {"nombre":"marlon","grupo":4},
                                        {"nombre":"brayan","grupo":5},
                                        {"nombre":"esteban","grupo":5},
                                
                                      ],

                            "disco": [
                                       {

                                        "archivo": [
                                        
                                                    {"permiso":"-rw-r-----","duenio":0,"grupo":4,"fecha":"2020-10-01","nombre":"file-1"},
                                                    {"permiso":"-rw-r-----","duenio":1,"grupo":4,"fecha":"2020-09-11","nombre":"file-2"},
                                                    {"permiso":"-rw-r-----","duenio":2,"grupo":5,"fecha":"2020-08-01","nombre":"file-3"},
                                                    {"permiso":"-rw-r-----","duenio":3,"grupo":5,"fecha":"2020-07-01","nombre":"file-4"}

                                                    ],

                                        "directorio": [
                                        
                                                         {"permiso":"-rw-r-----","duenio":2,"grupo":5,"fecha":"2020-10-01"}
                                                      ]

                                        }
                                    ]
                        },

                        {
                            "nombre":"maquina-2",
                            "ip": "192.168.0.2",
                            "grupo": ["camilo","sara","laura","alejandra","ventas","compras"],
                            "usuario":[
                                
                                        {"nombre":"camilo","grupo":4},
                                        {"nombre":"sara","grupo":4},
                                        {"nombre":"laura","grupo":5},
                                        {"nombre":"alejandra","grupo":5},
                                
                                      ],

                            "disco": [
                                       {

                                        "archivo": [
                                        
                                                    {"permiso":"-rw-r-----","duenio":0,"grupo":4,"fecha":"2020-10-04","nombre":"file-1"},
                                                    {"permiso":"-rw-r-----","duenio":1,"grupo":4,"fecha":"2020-09-21","nombre":"file-2"},
                                                    {"permiso":"-rw-r-----","duenio":2,"grupo":5,"fecha":"2020-08-11","nombre":"file-3"},
                                                    {"permiso":"-rw-r-----","duenio":3,"grupo":5,"fecha":"2020-07-13","nombre":"file-4"}

                                                    ],

                                        "directorio": [
                                        
                                                         {"permiso":"-rw-r-----","duenio":1,"grupo":4,"fecha":"2020-07-05"}
                                                      ]

                                        }
                                    ]
                        },

                        {
                            "nombre":"maquina-3",
                            "ip": "192.168.0.3",
                            "grupo": ["estefany","daniela","daniel","dario","marketing","gerontologia"],
                            "usuario":[
                                
                                        {"nombre":"estafany","grupo":4},
                                        {"nombre":"daniela","grupo":4},
                                        {"nombre":"daniel","grupo":5},
                                        {"nombre":"dario","grupo":5},
                                
                                      ],

                            "disco": [
                                       {

                                        "archivo": [
                                        
                                                    {"permiso":"-rw-r-----","duenio":0,"grupo":4,"fecha":"2020-10-01","nombre":"file-1"},
                                                    {"permiso":"-rw-r-----","duenio":1,"grupo":4,"fecha":"2020-9-11","nombre":"file-2"},
                                                    {"permiso":"-rw-r-----","duenio":2,"grupo":5,"fecha":"2020-8-01","nombre":"file-3"},
                                                    {"permiso":"-rw-r-----","duenio":3,"grupo":5,"fecha":"2020-7-01","nombre":"file-4"},

                                                    ],

                                        "directorio": [
                                        
                                                         {"permiso":"-rw-r-----","duenio":1,"grupo":0,"fecha":"2020-10-01"}
                                                      ]

                                        }
                                    ]
                        },

                        {
                            "nombre":"maquina-4",
                            "ip": "192.168.0.4",
                            "grupo": ["mateo","matias","martin","santiago","derecho","negocios"],
                            "usuario":[
                                
                                        {"nombre":"mateo","grupo":4},
                                        {"nombre":"matias","grupo":4},
                                        {"nombre":"martin","grupo":5},
                                        {"nombre":"santiago","grupo":5},
                                
                                      ],

                            "disco": [
                                       {

                                        "archivo": [
                                        
                                                    {"permiso":"-rw-r-----","duenio":0,"grupo":4,"fecha":"2020-10-01","nombre":"file-1"},
                                                    {"permiso":"-rw-r-----","duenio":1,"grupo":4,"fecha":"2020-9-11","nombre":"file-2"},
                                                    {"permiso":"-rw-r-----","duenio":2,"grupo":5,"fecha":"2020-8-01","nombre":"file-3"},
                                                    {"permiso":"-rw-r-----","duenio":3,"grupo":5,"fecha":"2020-7-01","nombre":"file-4"}

                                                    ],

                                        "directorio": [
                                        
                                                         {"permiso":"-rw-r-----","duenio":1,"grupo":0,"fecha":"2020-10-01"}
                                                      ]

                                        }
                                    ]
                        }
                    ]



          }