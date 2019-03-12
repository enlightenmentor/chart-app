function dispatchDragEvent(node, name, mouseevent, prevX, prevY, dragCb) {
  const details = {
    x: mouseevent.x,
    y: mouseevent.y,
    clientX: mouseevent.clientX,
    clientY: mouseevent.clientY,
    layerX: mouseevent.layerX,
    layerY: mouseevent.layerY,
    offsetX: mouseevent.offsetX,
    offsetY: mouseevent.offsetY,
    pageX: mouseevent.pageX,
    pageY: mouseevent.pageY,
    screenX: mouseevent.screenX,
    screenY: mouseevent.screenY,
    movementX: mouseevent.x - prevX,
    movementY: mouseevent.y - prevY
  };
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
    if (event.which === 1) {
      prevX = event.x;
      prevY = event.y;
      window.addEventListener('mousemove', dragCallback);
      window.addEventListener('mouseup', endCallback);
      dispatchDragEvent(node, 'draggingstart', event, prevX, prevY, dragCb);
    }
  };

  const dragCallback = (event) => {
    event.preventDefault();
    dispatchDragEvent(node, 'dragging', event, prevX, prevY, dragCb);
    prevX = event.x;
    prevY = event.y;
  };

  const endCallback = (event) => {
    window.removeEventListener('mousemove', dragCallback);
    window.removeEventListener('mouseup', endCallback);
    dispatchDragEvent(node, 'draggingend', event, prevX, prevY, dragCb);
    prevX = null;
    prevY = null;
  };

  node.addEventListener('mousedown', startCallback);

  node.onDrag = function(cb) {
    dragCb = cb;
  }

  return node;
}