routes = [
  {
    path: '/',
    url: './index.html',
    on: {
      pageBeforeIn: function (event, page) {
        
        // call ajax request to update
        setTimeout(function () {

          // http://212.24.111.23/
          app.request.get('http://212.24.111.23/kaori/member/saldo/'+ app.data.mbrid, function (res) {
          
            var data = JSON.parse(res);
        
            if (data.status) {
              $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
              app.data.saldo = parseInt(data.saldo);
              $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
              app.data.bonus = parseInt(data.bonus);
            } else {
              app.dialog.alert(data.message, 'KAORI');
            }
          });
        }, 1000);
      }
    }
        
  },
  {
    path: '/belanja/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      resolve(
        { componentUrl: './pages/belanja.html' },
        { context: { mbrid: null } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/belanja/:id',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      var mbrid = routeTo.params.id;

      resolve(
        { componentUrl: './pages/belanja.html' },
        { context: { mbrid: mbrid } }
      );
      app.preloader.hide();
    }
    /*url: './pages/belanja.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault(); 
          
          var mbrid = $$('#mbrid').val();
          
          if (mbrid == '') {
              app.dialog.alert('Masukkan ID member penjual.', 'Belanja');
              return;
          } else
          if (mbrid == app.data.mbrid) {
            app.dialog.alert('Nomor ID penjual tidak boleh sama dengan ID pembeli.', 'Belanja');
            return;
          }

          var nominal = $$('#nominal').val();

          if (nominal == '') {
              app.dialog.alert('Masukkan nominal belanja.', 'Belanja');
              return;
          } else
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda kosong. Silahkan topup saldo anda terlebih dahulu.', 'Belanja');
            return;
          } else
          if (app.data.saldo < 5000) {
            app.dialog.alert('Jumlah saldo anda belum mencukupi minimal belanja.', 'Belanja');
            $$('#belanja [name="nominal"]').val('0');
            return;
          } else
          if (nominal < 5000) {
            app.dialog.alert('Jumlah minimal belanja sebesar 5000.', 'Belanja');
            $$('#nominal').val(5000);
            return;
          }
          
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN anda.', 'Belanja');
            return;
          }
                  
          app.preloader.show();

          var formData = app.form.convertToData('.belanja');
          formData.Authorization = app.data.token;
          //console.log(formData);
          
          app.request.post('http://212.24.111.23/kaori/member/belanja', formData, function (res) {
            
            //console.log(res);
            app.preloader.hide();

            var data = JSON.parse(res);
        
            if (data.status) {
              
              app.router.back();

              // ambil informasi saldo member
              app.request.get('http://212.24.111.23/kaori/member/saldo/'+app.data.mbrid, function (res) {
                  
                var data = JSON.parse(res);
            
                if (data.status) {
                  $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
                  app.data.saldo = parseInt(data.saldo);
                  $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
                  app.data.bonus = parseInt(data.bonus);
                } else {
                  app.dialog.alert(data.message);
                }
              });
            } else {
              $$('#pin').val('');
              app.dialog.alert(data.message, 'Belanja');
            }
          });
        });            
      }
    }*/
  },
  {
    path: '/pulsa/',
    url: './pages/pulsa.html',
    on: {
      pageInit: function (event, page) {
        
        function updateList(hlr) {
          app.request.json('http://212.24.111.23/kaori/pulsa/'+hlr, function (json) {

            $$('#nominal').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#nominal').append('<option value="'+json[i].kode+'">'+json[i].nominal+'</option>')
            }
    
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$(this).val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });

        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Pulsa HP');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Pulsa HP');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal pulsa.', 'Pulsa HP');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pengisian pulsa.', 'Pulsa HP');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/pulsa', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Pulsa HP');
              }
            }
          });
        });            
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      // pageAfterOut: function (event, page) {
      
        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      // }
    }
  },
  {
    path: '/data/',
    url: './pages/data.html',
    on: {
      pageInit: function (event, page) {
        
        function updateList(hlr) {
          app.request.json('http://212.24.111.23/kaori/data/'+hlr, function (json) {

            $$('#paket').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#paket').append('<option value="'+json[i].kode+'">'+json[i].nama+'</option>')
            }
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$('#tujuan').val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket Data');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket Data');
              return;
          }
          
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian paket data.', 'Paket Data');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxdata');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/data', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket Data');
              }
            }
          });
        });            
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      // pageAfterOut: function (event, page) {
      
        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      // }
    }
  },
  {
    path: '/token/',
    url: './pages/token.html',
    on: {
      pageInit: function (event, page) {
        
        /*var numpad = app.keypad.create({
          inputEl: '#nopel',
          dotButton: false,
          valueMaxLength: 11,
        }); 
        
        var numpad2 = app.keypad.create({
          inputEl: '#tujuan',
          dotButton: false,
          valueMaxLength: 13,
        });*/
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var nopel = $$('#nopel').val();
          if (nopel == '') {
            app.dialog.alert('Masukkan data nomor pelanggan.', 'Token PLN');
            return;
          }

          var rgx_nopel = /[0-9]{11,}/;
          var noplg = nopel.trim().match(rgx_nopel);
          if (!noplg) {
            app.dialog.alert('Input data nomor pelanggan belum benar.', 'Token PLN');
            return;
          }

          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Token PLN');
              return;
          }
          
          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
            app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Token PLN');
            return;
          }

          var nominal = $$('#nominal').val();
          if (nominal == '') {
              app.dialog.alert('Pilih nominal token.', 'Token PLN');
              return;
          } else
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian token PLN.', 'Token PLN');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpln');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/pln', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Token PLN');
              }
            }
          });
        });            
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      // pageAfterOut: function (event, page) {
      
        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      // }
    }
  },
  {
    path: '/telpon/',
    url: './pages/telpon.html',
    on: {
      pageInit: function (event, page) {
        
        /*var numpad = app.keypad.create({
          inputEl: '#tujuan',
          dotButton: false,
          valueMaxLength: 13,
          on: {
            change(keypad, value) {
              // console.log(keypad, value);
              value = value.toString();
              if (value.length === 4) {
                updateList(value);
              }
            }
          }
        });*/
        
        function updateList(hlr) {
          app.request.json('http://212.24.111.23/kaori/telpon/'+hlr, function (json) {

            $$('#nominal').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#nominal').append('<option value="'+json[i].kode+'">'+json[i].nominal+'</option>')
            }
    
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$('#tujuan').val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });

        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket Nelpon');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket Nelpon');
              return;
          }

          var nominal = $$('#nominal').val();
          if (nominal == '') {
              app.dialog.alert('Pilih nominal pakat.', 'Paket Nelpon');
              return;
          }
          
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian paket nelpon.', 'Paket Nelpon');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxtelpon');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/telpon', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket Nelpon');
              }
            }
          });
        });            
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      // pageAfterOut: function (event, page) {
      
        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      // }
    }
  },
  {
    path: '/sms/',
    url: './pages/sms.html',
    on: {
      pageInit: function (event, page) {
        
        /*var numpad = app.keypad.create({
          inputEl: '#tujuan',
          dotButton: false,
          valueMaxLength: 13,
          on: {
            change(keypad, value) {
              // console.log(keypad, value);
              value = value.toString();
              if (value.length === 4) {
                updateList(value);
              }
            }
          }
        });*/
        
        function updateList(hlr) {
          app.request.json('http://212.24.111.23/kaori/sms/'+hlr, function (json) {

            $$('#nominal').html('');
            for (var i = 0; i < json.length; i++) {
              $$('#nominal').append('<option value="'+json[i].kode+'">'+json[i].nominal+'</option>')
            }
    
          });
        }
        
        $$('#tujuan').on('input', function(){
          
          var str = $$('#tujuan').val();
          
          if (str.length < 4) {
            $$('#nominal').html('');
          } else
          if (str.length == 4) {
            updateList(str);
          } else {
            var str = $$(this).val().substring(0, 4);
            updateList(str);
          }
        });

        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan == '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket SMS');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket SMS');
              return;
          }

          var nominal = $$('#nominal').val();
          if (nominal == '') {
              app.dialog.alert('Pilih nominal paket sms.', 'Paket SMS');
              return;
          }
          
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi pembelian paket sms.', 'Paket SMS');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxsms');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/sms', formData, function (res) {
            
            // app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              // setTimeout(function () {
                app.router.back();
              // }, 500);
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket SMS');
              }
            }
          });
        });            
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      // pageAfterOut: function (event, page) {
      
        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      // }
    }
  },
  {
    path: '/gopay/',
    url: './pages/topup-gopay.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Topup GOPAY');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Topup GOPAY');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Topup GOPAY');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi topup GOPAY.', 'Topup GOPAY');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/gopay', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup GOPAY');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/ovo/',
    url: './pages/topup-ovo.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Topup OVO');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Topup OVO');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Topup OVO');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi topup OVO.', 'Topup OVO');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/ovo', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup OVO');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/dana/',
    url: './pages/topup-dana.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Topup DANA');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Topup DANA');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Topup DANA');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi topup DANA.', 'Topup DANA');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/dana', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup DANA');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/hinet/',
    url: './pages/hinet.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              var nomor = contact.phoneNumbers[0].value;
              $$('#tujuan').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              var str = $$('#tujuan').val().substring(0, 4);
              updateList(str);
          },function(err){
              // alert('Error: ' + err);
              $$('#tujuan').val('');
          });
        });
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var tujuan = $$('#tujuan').val();
          if (tujuan === '') {
              app.dialog.alert('Masukkan data nomor hp tujuan.', 'Paket HINET');
              return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohp = tujuan.trim().match(rgx_nohp);
          if (!nohp) {
              app.dialog.alert('Input data nomor hp tujuan belum benar.', 'Paket HINET');
              return;
          }

          var kode = $$('#nominal').val();
          if (kode === '') {
              app.dialog.alert('Pilih nominal topup.', 'Paket HINET');
              return;
          }
          
          if (app.data.saldo === 0) {
            app.dialog.alert('Saldo anda tidak cukup untuk melakukan transaksi isi ulang paket HINET.', 'Paket HINET');
            return;
          }
          
          // app.preloader.show();
          $$(this).prop("disabled", true);

          var formData = app.form.convertToData('.trxpulsa');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/hinet', formData, function (res) {
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {

              $$(this).prop("disabled", false);
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Paket HINET');
              }
            }
          });
        });            
      },
    }
  },
  {
    path: '/topup-saldo/',
    url: './pages/topup-saldo.html',
    on: {
      pageInit: function (event, page) {
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var nominal = $$('#nominal').val();
          
          if (nominal == '') {
              app.dialog.alert('Masukkan jumlah nominal topup saldo.', 'Topup Saldo');
              return;
          } else
          if (nominal < 50000) {
            app.dialog.alert('Jumlah minimal topup saldo sebesar 50.000.', 'Topup Saldo');
            return;
          }
                  
          app.preloader.show();

          var formData = app.form.convertToData('.topup');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/member/topup', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {
              if (data.message !== '') {
                app.dialog.alert(data.message, 'Topup Saldo');
              }
            }
          });
        });            
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
    }
  },
  {
    path: '/notifikasi/',
    componentUrl: './pages/notifikasi.html',
  },
  {
    path: '/cek-harga/',
    url: './pages/cek-harga.html',
  },
  {
    path: '/cek-harga-pulsa/',
    url: './pages/cek-harga-pulsa.html',
  },
  {
    path: '/cek-harga-data/',
    url: './pages/cek-harga-data.html',
  },
  {
    path: '/cek-harga-topup/',
    url: './pages/cek-harga-topup.html',
  },
  {
    path: '/cek-harga-telpon/',
    url: './pages/cek-harga-telpon.html',
  },
  {
    path: '/cek-harga-sms/',
    url: './pages/cek-harga-sms.html',
  },
  {
    path: '/cek-harga-hinet/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      //var opr = routeTo.params.opr;

      // Simulate Ajax Request
      app.request.json("http://212.24.111.23/kaori/hinet/cekharga", function(json) {
          
        var data = { title: 'Harga Paket HINET', list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-pulsa/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json("http://212.24.111.23/kaori/pulsa/cekharga/"+opr, function(json) {
          
        var data = { title: 'Harga Pulsa ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-data/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json("http://212.24.111.23/kaori/data/cekharga/"+opr, function(json) {
          
        var data = { title: 'Harga Paket Data ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-topup/:opr',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;

      app.request.json("http://212.24.111.23/kaori/topup/cekharga/"+opr, function(json) {
          
        var data = { title: 'Harga Topup ' + opr, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-telpon/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json("http://212.24.111.23/kaori/telpon/cekharga/"+opr, function(json) {
          
        var data = { title: 'Harga Paket Nelpon ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-sms/:opr/:nama',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;
      var nama = routeTo.params.nama;

      app.request.json("http://212.24.111.23/kaori/sms/cekharga/"+opr, function(json) {
          
        var data = { title: 'Harga Paket SMS ' + nama, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-pln/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      //var opr = routeTo.params.opr;

      // Simulate Ajax Request
      app.request.json("http://212.24.111.23/kaori/pln/cekharga", function(json) {
          
        var data = { title: 'Harga Token PLN', list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/harga-game/:opr',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      // kode operator
      var opr = routeTo.params.opr;

      app.request.json("http://212.24.111.23/kaori/game/cekharga/"+opr, function(json) {
          
        var data = { title: 'Harga Paket Game ' + opr, list: json };

        resolve(
          { componentUrl: './pages/daftar-harga.html' },
          { context: { data: data, } }
        );
        app.preloader.hide();
      });
    }
  },
  {
    path: '/daftar/',
    url: './pages/pendaftaran.html',
    on: {
      pageInit: function (event, page) {
        
        $$('.contact').on('click', function(e){
     
          navigator.contacts.pickContact(function(contact){
              //console.log('The following contact has been selected:' + JSON.stringify(contact));
              var nomor = contact.phoneNumbers[0].value;
              $$('#nohp').val(nomor.replace('+62','0').replace(/-/g,'').replace(/ /g,''));
              // $$('#nama').val(contact.name.givenName);
          },function(err){
              //console.log('Error: ' + err);
              // alert('Error: ' + err);
          });
        });
        
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();

          // if (app.data.saldo == 0) {
          //   app.dialog.alert('Saldo anda kosong. Silahkan topup saldo anda terlebih dahulu.', 'Pendaftaran Member');
          //   return;
          // } else
          // if (app.data.saldo < 100000) {
          //   app.dialog.alert('Jumlah minimum saldo agar anda bisa mendaftarkan anggota adalah 100.000', 'Pendaftaran Member');
          //   return;
          // }

          var nohp = $$('#nohp').val();
          if (nohp === '') {
            app.dialog.alert('Masukkan data nomor handphone.', 'Pendaftaran Member');
            return;
          }

          var rgx_nohp = /[08][0-9]{9,}/;
          var nohpx = nohp.trim().match(rgx_nohp);
          if (!nohpx) {
            app.dialog.alert('Input data nomor handphone belum benar.', 'Pendaftaran Member');
            return;
          }
          
          var nama = $$('#nama').val();
          if (nama == '') {
            app.dialog.alert('Masukkan nama member.', 'Pendaftaran Member');
            return;
          }

          var rgx_nama = /^[a-zA-Z]'?([a-zA-Z]|\,|\.| |-)+$/;
          var namax = nama.trim().match(rgx_nama);
          if (!namax) {
            app.dialog.alert('Input data nama belum benar.', 'Pendaftaran Member');
            return;
          }
        
          app.preloader.show();

          var formData = app.form.convertToData('.pendaftaran');
          formData.mbrid = app.data.mbrid;
          
          app.request.post('http://212.24.111.23/kaori/member', formData, function (res) { //212.24.111.23
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              
              app.dialog.alert(data.message, 'Registrasi Member');
              app.router.back();

              // ambil informasi saldo member
              app.request.get('http://212.24.111.23/kaori/member/saldo/'+app.data.mbrid, function (res) {
                  
                var data = JSON.parse(res);
            
                if (data.status) {
                  $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
                  app.data.saldo = parseInt(data.saldo);
                  $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
                  app.data.bonus = parseInt(data.bonus);
                } else {
                  app.dialog.alert(data.message);
                }
              });

            } else {
              app.dialog.alert(data.message, 'Pendaftaran Member');
            }
          });
        });                  
      }
    }
  },
  {
    path: '/transfer-saldo/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();

      resolve(
        { componentUrl: './pages/transfer-saldo.html' },
        { context: { mbrid: null } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/transfer-saldo/:id',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      var mbrid = routeTo.params.id;

      resolve(
        { componentUrl: './pages/transfer-saldo.html' },
        { context: { mbrid: mbrid } }
      );
      app.preloader.hide();
    }
    /*url: './pages/transfer-saldo.html',
    on: {
      pageInit: function (event, page) {
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault(); 
          
          var mbrid = $$('#mbrid').val();
          
          if (mbrid == '') {
              app.dialog.alert('Masukkan ID member tujuan.', 'Transfer Saldo');
              return;
          } else
          if (mbrid == app.data.mbrid) {
            app.dialog.alert('Nomor ID tujuan tidak boleh sama dengan ID asal.', 'Transfer Saldo');
            return;
          }

          var nominal = $$('#nominal').val();

          if (nominal == '') {
              app.dialog.alert('Masukkan nominal transfer saldo.', 'Transfer Saldo');
              return;
          } else
          if (app.data.saldo == 0) {
            app.dialog.alert('Saldo anda kosong. Silahkan topup saldo anda terlebih dahulu.', 'Transfer Saldo');
            return;
          } else
          if (app.data.saldo < 1000) {
            app.dialog.alert('Jumlah saldo anda belum mencukupi minimal transfer.', 'Transfer Saldo');
            $$('#withdrawal [name="nominal"]').val('0');
            return;
          } else
          if (nominal < 1000) {
            app.dialog.alert('Jumlah minimal transfer saldo sebesar 1000.', 'Transfer Saldo');
            $$('#nominal').val(1000);
            return;
          } else
          if (nominal > app.data.saldo) {
            app.dialog.alert('Jumlah maksimal saldo yang bisa ditransfer adalah ' + app.data.saldo +'.', 'Transfer Saldo');
            return;
          }
          
          var pin = $$('#pin').val();
          if (pin === '') {
            app.dialog.alert('Masukkan nomor PIN anda.', 'Transfer Saldo');
            return;
          }
                  
          app.preloader.show();

          var formData = app.form.convertToData('.trfsaldo');
          formData.Authorization = app.data.token;
          //console.log(formData);
          
          app.request.post('http://212.24.111.23/kaori/member/trfsaldo', formData, function (res) {
            
            //console.log(res);
            app.preloader.hide();

            var data = JSON.parse(res);
        
            if (data.status) {
              
              app.router.back();

              // ambil informasi saldo member
              app.request.get('http://212.24.111.23/kaori/member/saldo/'+app.data.mbrid, function (res) {
                  
                var data = JSON.parse(res);
            
                if (data.status) {
                  $$('.saldo').text(parseInt(data.saldo).toLocaleString('ID'));
                  app.data.saldo = parseInt(data.saldo);
                  $$('.bonus').text(parseInt(data.bonus).toLocaleString('ID'));
                  app.data.bonus = parseInt(data.bonus);
                } else {
                  app.dialog.alert(data.message);
                }
              });
            } else {
              $$('#pin').val('');
              app.dialog.alert(data.message, 'Transfer Saldo');
            }
          });
        });            
      }
    }*/
  },
  {
    path: '/qr-barcode/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
      var code = localStorage.getItem('mbrid');
      var nama = localStorage.getItem('nama').toUpperCase();

      resolve(
        { componentUrl: './pages/qr-barcode.html' },
        { context: { code: code, nama: nama } }
      );
      app.preloader.hide();
    }
  },
  {
    path: '/histori-trx/',
    async: function (routeTo, routeFrom, resolve, reject) {
      // Router instance
      var router = this;

      // App instance
      var app = router.app;

      // Show Preloader
      app.preloader.show();
        
      if (!app.data.currentDate) {
      
        var now = new Date();
        
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        
        var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
        app.data.currentDate = today;
      }
      
      var formData = [];

      formData.tgltrx = app.data.currentDate;
      formData.Authorization = app.data.token;
      
      app.request.post("http://212.24.111.23/kaori/member/historitrx", formData, function(res) {
          
        var data = JSON.parse(res);

        resolve(
          { componentUrl: './pages/histori-trx.html' },
          { context: { data: data } }
        );
        app.preloader.hide();
      });
    },
    
    on: {
      pageInit: function (event, page) {
        
        $$('#tgltrx').val(app.data.currentDate);
      
        $$('#tgltrx').on('change', function(e){

          app.data.currentDate = $$('#tgltrx').val();
          app.router.navigate('/histori-trx/', {
            reloadCurrent: true,
            ignoreCache: true,
          });
        });
      
      },
      pageAfterOut: function (event, page) {
      
        app.data.currentDate = null;
      }
    },
  },
  {
    path: '/akun/',
    url: './pages/akun.html',
    on: {
      pageInit: function (event, page) {
        
        var mbrid = app.data.mbrid;
        
        app.request.get('http://212.24.111.23/kaori/member/saldo/'+mbrid, function (res) {
            
          var data = JSON.parse(res);
        
          if (data.status) {
            $$('#saldo').text(parseInt(data.saldo).toLocaleString('ID'));
            app.data.saldo = parseInt(data.saldo);

            // $$('#poin').text(parseInt(data.poin).toLocaleString('ID'));
            // app.data.poin = parseInt(data.poin);

            $$('#bonus').text(parseInt(data.bonus).toLocaleString('ID'));
            app.data.bonus = parseInt(data.bonus);

          } else {
            app.dialog.alert(data.message, 'Akun Saya');
          }
        });
        
        $$('.cek-id').on('click', function(e){
          
          app.request.get('http://212.24.111.23/kaori/member/cek_id/'+ app.data.mbrid, function (res) {
            
            var data = JSON.parse(res);
    
            // if (data.status) {
              app.dialog.alert(data.message, 'Akun Saya');
            // } else {
              // app.dialog.alert(data.message, 'Akun Saya');
            // }
          });
        });
      }
    }
  },
  {
    path: '/komplain/',
    url: './pages/komplain.html',
    on: {
      pageInit: function (event, page) {
      
        $$('.btnKirim').on('click', function(e){
          //e.preventDefault();
          
          var info = $$('#info').val();
          
          if (info == '') {
              app.dialog.alert('Masukkan pesan info/komplain.', 'Info / Komplain');
              return;
          }
          
          app.preloader.show();

          var formData = app.form.convertToData('.komplain');
          formData.Authorization = app.data.token;
          
          app.request.post('http://212.24.111.23/kaori/member/komplain', formData, function (res) {
            
            app.preloader.hide();
            
            var data = JSON.parse(res);
        
            if (data.status) {
              app.router.back();
            } else {
              app.dialog.alert(data.message, 'Info / Komplain');
            }
          });
        });
      
        // if ( AdMob ) {
          // AdMob.hideBanner();
        // }
      },
      // pageAfterOut: function (event, page) {
      
        // if ( AdMob ) {
          // AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        // }
      // }
    }
  },
  {
    path: '/settings/',
    url: './pages/settings.html',
  },
  // Default route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];
