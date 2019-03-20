function dispatchDragEvent(node, name, data, prevX, prevY, dragCb) {
  const details = data ? {
    clientX: data.clientX,
    clientY: data.clientY,
    pageX: data.pageX,
    pageY: data.pageY,
    screenX: data.screenX,
    screenY: data.screenY,
    movementX: data.clientX - prevX,
    movementY: data.clientY - prevY
  } : null;
  const event = new CustomEvent(name, {
    composed: true,
    bubbles: true,
    detail: details
  })
  dragCb && dragCb(event);
  node.dispatchEvent(event);
}

export default function draggable(node) {
  let prevX = null;
  let prevY = null;
  let dragCb;

  const startCallback = (event) => {
    switch (event.type) {
      case 'mousedown':
        if (event.which === 1) {
          prevX = event.x;
          prevY = event.y;
          window.addEventListener('mousemove', dragCallback);
          window.addEventListener('mouseup', endCallback);
          dispatchDragEvent(node, 'draggingstart', event, prevX, prevY, dragCb);
        }
        break;
      case 'touchstart':
        prevX = event.touches[0].clientX;
        prevY = event.touches[0].clientY;
        dispatchDragEvent(node, 'draggingstart', event.touches[0], prevX, prevY, dragCb);
        break;
    }
  };

  const dragCallback = (event) => {
    switch (event.type) {
      case 'mousemove':
        event.preventDefault();
        dispatchDragEvent(node, 'dragging', event, prevX, prevY, dragCb);
        prevX = event.x;
        prevY = event.y;
        break;
      case 'touchmove':
        dispatchDragEvent(node, 'dragging',  event.touches[0], prevX, prevY, dragCb);
        prevX = event.touches[0].clientX;
        prevY = event.touches[0].clientY;
        break;
    }

  };

  const endCallback = (event) => {
    switch (event.type) {
      case 'mouseup':
        window.removeEventListener('mousemove', dragCallback);
        window.removeEventListener('mouseup', endCallback);
        dispatchDragEvent(node, 'draggingend', event, prevX, prevY, dragCb);
        prevX = null;
        prevY = null;
        break;
      case 'touchend':
        dispatchDragEvent(node, 'draggingend', event.touches[0], prevX, prevY, dragCb);
        prevX = null;
        prevY = null;
        break;
    }
  };

  node.addEventListener('touchstart', startCallback, {passive:true});
  node.addEventListener('touchmove', dragCallback, {passive:true});
  window.addEventListener('touchend', endCallback, {passive:true});

  node.addEventListener('mousedown', startCallback);

  node.onDrag = function(cb) {
    dragCb = cb;
  }

  return node;
}