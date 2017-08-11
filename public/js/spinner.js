 module.export = $(function(){

   var opts = {
     lines: 10, // The number of lines to draw
     length: 10, // The length of each line
     width: 7, // The line thickness
     radius: 12, // The radius of the inner circle
     color: '#000', // #rgb or #rrggbb
     speed: 1.4, // Rounds per second
     trail: 54, // Afterglow percentage
     shadow: false // Whether to render a shadow
   };

   $.fn.spinStart = function() {
     this.each(function() {
       var $this = $(this), data = $this.data();
       console.log($this);
       console.log(data.spinner);
       if (data.spinner) {
         data.spinner.stop();
         delete data.spinner;
       }
       if (opts !== false) {
         data.spinner = new Spinner($.extend({color: $this.css('color')}, opts)).spin(this);
       }
     });
     return this;
   };

   $.fn.spinStop = function (){
      var $this = $(this), data = $this.data();
      if (data.spinner) {
        data.spinner.stop();
        // $(this).data().spinner.stop();
      }
     // $('#'+id).data('spinner').stop();
   }
 });

// module.export = Spin;
