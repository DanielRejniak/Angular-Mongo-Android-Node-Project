(function () {
  var graph = document.querySelector("#graph"),
      text = document.querySelector("#updatingText"),
      graphRadius = graph.r.baseVal.value,
      strokeLength = 2 * Math.PI * graphRadius,
      offset = strokeLength,
      stopLength = Math.ceil(strokeLength - (strokeLength * 0.625)),
      textValue = (1 - offset / strokeLength) * -1;
  
  function animate () {
    if (offset > stopLength) {
      offset -= 5;
      textValue = Math.floor((1 - offset / strokeLength) * 200);
    
      graph.style.strokeDashoffset = offset;
      text.textContent = textValue
      
      requestAnimationFrame(animate);  
      
    } else {
      // repeat animation
      setTimeout(clear, 2000);
    }
  };
  
  function clear () {
    offset = strokeLength;
    animate();
  };
  
  setTimeout(animate, 1000);
  
})();