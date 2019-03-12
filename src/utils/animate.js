const easing = {
  LINEAR: function (t) { return t },
  EASE_IN_QUAD: function (t) { return t*t },
  EASE_OUT_QUAD: function (t) { return t*(2-t) },
  EASE_IN_OUT_QUAD: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  EASE_IN_QUBIC: function (t) { return t*t*t },
  EASE_OUT_QUBIC: function (t) { return (--t)*t*t+1 },
  EASE_IN_OUT_QUBIC: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  EASE_IN_QUART: function (t) { return t*t*t*t },
  EASE_OUT_QUART: function (t) { return 1-(--t)*t*t*t },
  EASE_IN_OUT_QUART: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t }
}

export default function animate(data, options) { // {data:[from,to],options.{duration,easing}}
  const valueFrom = data[0];
  const valueDiff = data[1] - valueFrom;
  const duration = options.duration;
  const ease = easing[options.easing] || easing.LINEAR;

  let startTimestamp, onTick, onFinish;

  function update() {
    let tProgress = (new Date().getTime() - startTimestamp) / duration;
    tProgress = tProgress > 1 ? 1 : tProgress;
    let progress = ease(tProgress);
    let updatedValue = valueFrom + (valueDiff * progress);

    onTick && onTick(updatedValue);
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      onFinish();
    }
  }

  return function animateValue(cb) {
    onTick = cb;
    startTimestamp = new Date().getTime();
    requestAnimationFrame(update);
    return new Promise(resolve => { onFinish = resolve });
  };
}