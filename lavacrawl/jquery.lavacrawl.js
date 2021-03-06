(function($) { 

	// static constructs
	$.lava = $.lava || {version: '0.0.1'};
	
	// defaults & private methods
	$.lava.lavacrawl = {
	
		doCrawl: function(t, cameraDistance, rotation, stageHeight, finalPosition) {
			crawler.css({'-webkit-transition': '-webkit-transform '+t+' linear',
									 '-webkit-transform': 'translate3d(0,0,'+cameraDistance+') translateY('+stageHeight+'px) rotateX('+rotation+') translateY('+finalPosition+')'});
		},
	
		conf: {  
			load: true,
			auto_crawl: true,
			perspective_distance: '400px',
			camera_distance: '330px',
			rotation: '30deg',
			crawl_t: '60s'
		}
	};

	function LavaCrawl(container, conf){

		//private variables
		var self = this,
			stage = container,
			stageHeight = stage.height();
			crawler = stage.children().first();
			
		//API methods
		$.extend(self, {
			load: function() {
				
				//Setup stage perspective
				stage.css({'-webkit-transform-origin': '50% 100%', 
									 '-webkit-perspective': conf.perspective_distance});
				
				crawler.css({'-webkit-transform-origin': '50% 0'});
				
				//stage needs to be >= 2x crawler width or crawler may get cut off
				if( stage.width() < 2*crawler.width()){
					stage.width(2*crawler.width());
				}

				
				//setup crawler perspective
				crawler.css({ 'margin-left' : 'auto', 
											'margin-right': 'auto',
											'-webkit-transform': 'translate3d(0,0,'+conf.camera_distance+') translateY('+stageHeight+'px) rotateX('+conf.rotation+')'});
									
				return self;
			},
			
			crawl: function(){
				//setTime to make sure crawler is in starting position before animating
				setTimeout( function(){ $.lava.lavacrawl.doCrawl(conf.crawl_t, conf.camera_distance, conf.rotation, stageHeight, -2*crawler.height()+'px') }, 1);
			}
			
		});
			
		// autoload
		if (conf.load) { self.load(); }
		
		// autocrawl
		if (conf.auto_crawl) { self.crawl(); }
		
	}

	
	// jQuery plugin initialization
	$.fn.lavacrawl = function(conf) {   
		
		// already constructed a lavacrawl on this guy? Just return the API!
		var el = this.data("lavacrawl");
		if (el) { return el; }	  		 
		
		conf = $.extend(true, {}, $.lava.lavacrawl.conf, conf);
		
		//For each element called on, create a new LavaCrawl (with this config)
		//and store it with the element (so we can grab the API later, see above)
		// [NB this refers to the element(s) .lavacrawl was called on...]
		this.each(function() {		
			el = new LavaCrawl($(this), conf);
			$(this).data("lavacrawl", el);	
		});
		
		return el;		
	}; 
	
})(jQuery);
