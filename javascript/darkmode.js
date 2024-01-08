document.addEventListener('DOMContentLoaded', function() {
   document.getElementById('darkmode-toogle').addEventListener('change', function() {
       document.body.classList.toggle('dark-mode', this.checked);
   });
});
