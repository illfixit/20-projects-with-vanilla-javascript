const container = document.getElementById('container');
const imageContainer = document.getElementById('image-container');
const image = document.getElementById('image');
const text = document.getElementById('text');
const subredditContainer = document.getElementById('subreddit-container');
const subreddit = document.getElementById('subreddit');
const sorting = document.getElementById('sorting');
const sortByHot = document.getElementById('sort-by-hot');
const sortByTop = document.getElementById('sort-by-top');

let subredditName = ''
let hotImages = [];
let topImages = [];
let afterTop = '';
let afterHot = '';

let hotResult;
let topResult;

function chooseSubreddit() {

	subreddit.addEventListener('keydown', (e => {
		if (e.which == 13 || e.keyCode == 13 || e.key === 'Enter') {
			if(subreddit.value) {
				subredditName = subreddit.value.trim();
				subreddit.value = '';
				subreddit.style.display = 'none';
				subredditContainer.style.display = 'none';
				sorting.classList.remove('hidden');

				fetchImages(subredditName);
			} 
		}
	}))

	subreddit.addEventListener('input', (e) => { 
	 })

}


function fetchImages(subredditName) {

	hotResult = fetch(`https://www.reddit.com/r/${subredditName}.json?limit=100`)
      .then(res => res.json())
        .then(data => { 
        	afterHot = data.data.after;
        	return data.data.children.map(data => data.data);
        })
          .then(results =>  { results.forEach(post => { 
   	          		if (post.preview) {
          			hotImages.push(post.preview.images[0].source.url.replace(/amp;/gi,""))
          			// let index =  Math.floor(post.preview.images[0].resolutions.length/2);
          			// console.log(index);
          			// hotImages.push(post.preview.images[0].resolutions[index].url.replace(/amp;/gi,""))
          	}}
          	)})

 	topResult = fetch(`https://www.reddit.com/r/${subredditName}/top.json?t=all&limit=100`)
      .then(res => res.json())
        .then(data => {
        	afterHot = data.data.after;
        	return data.data.children.map(data => data.data);
        })
          .then(results =>  {	results.forEach(post => {
          					afterTop = results[results.length-1].name
          	          		if (post.preview) {
           						topImages.push(post.preview.images[0].source.url.replace(/amp;/gi,""))
           						// let index =  Math.floor(post.preview.images[0].resolutions.length/2);
           						// topImages.push(post.preview.images[0].resolutions[index].url.replace(/amp;/gi,""))
      						 }}
       				)})
	 

    sortByHot.addEventListener('click', ()=> { 
		sorting.classList.add('hidden');
		container.style.display = 'none';
		startMeditation(hotResult, 'hot');
	});

	sortByTop.addEventListener('click', ()=> { 
		sorting.classList.add('hidden');
		container.style.display = 'none';
		startMeditation(topResult, 'top');
	});
}

function downloadMoreImages(s) {
	console.log(s, afterHot)
	if (s === 'hot') {
		fetch(`https://www.reddit.com/r/${subredditName}.json?after=${afterHot}`)
	      .then(res => res.json())
	        .then(data => { return data.data.children.map(data => data.data);})
	          .then(results =>  { results.forEach(post => { 
	          		console.log(post)
	          		afterHot = results[results.length-1].name
	          		if (post.preview) {
	          			// hotImages.push(post.preview.images[0].source.url.replace(/amp;/gi,""))
	          			let index =  Math.floor(post.preview.images[0].resolutions.length/2);
	          			// console.log(index);
	          			hotImages.push(post.preview.images[0].resolutions[index].url.replace(/amp;/gi,""))
	          	}}
	          	)})

	} else if (s === 'top') {
		fetch(`https://www.reddit.com/r/${subredditName}/top.json?t=all&after=${afterTop}`)
	      .then(res => res.json())
	        .then(data => { return data.data.children.map(data => data.data);})
	          .then(results =>  {	results.forEach(post => {
	          	          		if (post.preview) {
	          	          			console.log(post)
	           						// topImages.push(post.preview.images[0].source.url.replace(/amp;/gi,""))
	           						let index =  Math.floor(post.preview.images[0].resolutions.length/2);
	           						topImages.push(post.preview.images[0].resolutions[index].url.replace(/amp;/gi,""))
	      						 }}
	       				)})
	}




}


function startMeditation(result, s) {

	if (s === 'hot') {
		images = hotImages;
	} else if (s === 'top') {
		images = topImages;
	}

	text.innerText = 'Breath In';
	let i = 0;

     result.then(() => {
     	image.src = images[0];
     	image.classList.add('grow');
     	image.classList.remove('hidden');
     	setInterval(() => {
     		i++;
			text.innerText === 'Breath In'
			? (text.innerText = 'Breath Out')
			: (text.innerText = 'Breath In');
			image.classList.toggle('grow');
			image.classList.toggle('shrink');
			image.src = images[i];

			if(i > images.length - 2) {
				downloadMoreImages(s);
			}
		}, 6000);
	// pointer.style.animation = 'rotate 12s linear forwards infinite';
     })
}

chooseSubreddit();
