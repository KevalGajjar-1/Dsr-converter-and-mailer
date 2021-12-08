document.addEventListener('DOMContentLoaded', function () {
  $ = jQuery;
  $('.dsr-text').on('keyup', function () {
    const dsrTextInput = $(this).val();
    storeDsr('dsr', dsrTextInput);
  });

  // setDefaultDsr();
  chrome.storage.local.get('dsr', function (result) {
    if (result && result.dsr) {
      $('.dsr-text').val(result.dsr);
    }
  });
  var copyButton = document.getElementById('copy-btn');
  copyButton.addEventListener('click', function () {
    chrome.tabs.getSelected(null, function (tab) {
      $ = jQuery;
      const dsrTextInput = $('.dsr-text').val();
      let dsr = dsrTextInput.split("Thanks")[0].trim();
      let data = ['Daily', 'Project', 'Completed', 'Tomorrow'];
      data = data.map(item => dsr.split('\n').filter(item1 => item1.includes(item))).flat();
      data = [...new Set(data)];
      data.map(item => {
        dsr = dsr.split(item).join(`*${item}*`);
      });
      var $temp = $('<textarea>');
      var brRegex = /<br\s*[\/]?>/gi;
      $('body').append($temp);
      $temp.val(dsr.replace(brRegex, '\r\n')).select();
      document.execCommand('copy');
      storeDsr('dsr', dsrTextInput);
      $temp.remove();
      alert("Text copied");
      // sendEmail('kevalkeval805@gmail.com', dsrTextInput.split('\n')[0], dsrTextInput);
      mailto('kevalkeval805@gmail.com', dsrTextInput.split('\n')[0], dsrTextInput);

    });
  }, false);
}, false);

function storeDsr(name, value) {
  const valueName = name;
  const storeValue = value;
  const object = {};
  object[valueName] = storeValue;
  chrome.storage.local.set(object, function (result) {
    return result;
  });
}


function setDefaultDsr() {
  const getDsr = getStoreValue('dsr');
  console.log(getDsr);
  if (getDsr && getDsr.dsr) {
    console.log('yup', getDsr.dsr);
  }
}

function mailto(to, subject, body) {
  const url = "https://mail.google.com/mail?view=cm&tf=0" +
    (to ? ("&to=" + to) : "") +
    (subject ? ("&su=" + subject) : "") +
    (body ? ("&body=" + encodeURIComponent(body)) : "");
  window.open(url);
}

function sendEmail(to, subject, body) {

  return new Promise((resolve, reject) => {
    $.ajax({
      url: `https://script.google.com/macros/s/AKfycbyEHF_Fh3gAqjaFJOu9JgoFvhGBbVQ7i0InrN686_Zp/dev?to=${to}&subject=${subject}&body=${body}`,
      method: "GET",
      success: () => {
        resolve(true)
        el.removeClass("is-loading")
        a("email sent", "success")
      }
    })
  })
}
