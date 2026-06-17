function load(url){
  console.log(url);
  if (url == "undefined"){
    var site = "https://nikhilt8144.github.io/";
  }else{
    var site = "https://nikhilt8144.github.io/"+url;
  }
  console.log(site);
  window.location.assign(site);
};
