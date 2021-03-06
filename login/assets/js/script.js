$(function(){

	var form = $('#login-register');

	form.on('submit', function(e){

		if(form.is('.loading, .loggedIn')){
			return false;
		}

		var email = form.find('input[name=email]').val(),
			messageHolder = form.find('span');
		var pass  = form.find('input[name=pass]').val();
		e.preventDefault();

		$.post(this.action, {email: email,pass:pass}, function(m){
			if(m.message.indexOf("http:")!=-1)
			window.location=m.message;
			if(m.error){
				form.addClass('error');
				messageHolder.text(m.message);
			}
			else{
				form.removeClass('error').addClass('loggedIn');
				messageHolder.text(m.message);
			}
		});

	});

	$(document).ajaxStart(function(){
		form.addClass('loading');
	});

	$(document).ajaxComplete(function(){
		form.removeClass('loading');
	});
});
