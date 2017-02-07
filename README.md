# RaspberryPi baby monitor

This is a baby monitor written with node.js, it allows streaming video with a web cam connected to a raspberryPi.

Thanks to phoboslab
https://github.com/phoboslab

By using jsmpeg a javascript decoder, I was able to decode the video stream and display it to a canvas element.
https://github.com/phoboslab/jsmpeg


## How to start the stream ##

1- install node.js
	
	sudo apt-get install node
	

2- install x264
	
	
	# build and make x264
	
	git clone --depth 1 git://git.videolan.org/x264
	
	cd x264
	
	./configure --host=arm-unknown-linux-gnueabi --enable-static --disable-opencl
	
	make -j 4
	
	sudo make install
	

3- install jsmpeg
	
	
	# build and make ffmpeg
	
	git clone --depth=1 git://source.ffmpeg.org/ffmpeg.git
	
	cd ffmpeg
	
	./configure --arch=armel --target-os=linux --enable-gpl --enable-libx264 --enable-nonfree
	
	make -j4
	
	sudo make install
	

4- clone the repository
	
	git clone https://github.com/mohamedgundour/r_pi-baby-monitor
	
	cd r_pi-baby-monitor/
	

5- install the dependencies
	
	npm install
	
	
6- start the server
	
	node app.js
	
	
7- navigate from your browser to
	
	http://raspberry_pi_IP:8082
	

### How it works ###
jsmpeg >>> http server >>> socket server >>> client


### whats next ###
1- adding controls to start/ stop streaming

2- adding audio to the stream

