let timer = null;

const queryString =
  ".x1oo3vh0 a.x1i10hfl.x1qjc9v5.xjbqb8w.xjqpnuy.xa49m3k.xqeqjp1.x2hbi6w.x13fuv20.xu3j5b3.x1q0q8m5.x26u7qi.x972fbf.xcfux6l.x1qhh985.xm0m39n.x9f619.x1ypdohk.xdl72j9.x2lah0s.xe8uvvx.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.x2lwn1j.xeuugli.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1n2onr6.x16tdsg8.x1hl2dhg.xggy1nq.x1ja2u2z.x1t137rt.x1o1ewxj.x3x9cwd.x1e5q0jg.x13rtm0m.x1q0g3np.x87ps6o.x1lku1pv.x1rg5ohu.x1a2a7pz";

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.trigger) {
    const origin = window.origin;
    const href = window.location.href;
    const arrHref = href.split("/");
    const linkGroupMember = origin + `/groups/${arrHref[4]}/members/`;
    window.location.replace(linkGroupMember);
    sendResponse("triggered");
  } else if (request.export) {
    exportExcel();
    sendResponse("exported");
  } else {
    sendResponse("not triggered");
  }
});

function exportExcel() {
  clearInterval(timer);

  const arrayProfile = getMemberList();

  chrome.runtime.sendMessage(
    { type: "exportMembers", data: arrayProfile },
    () => {
      // remove loading
      const loading = document.getElementById("loading");
      loading.parentNode.removeChild(loading);
    }
  );
}

function getMemberList() {
  const listItem = document.querySelectorAll(queryString);
  let arrayProfile = [];
  listItem.forEach((item) => {
    const arrHref = item.href.split("?");
    let link = arrHref[0].includes("profile.php")
      ? arrHref[0] + "?" + arrHref[1].split("&")[0]
      : arrHref[0];

    if (link.includes("/user/")) {
      const arrLink = link.split("/");
      link = `https://www.facebook.com/${arrLink[6]}`;
      const name = item.getAttribute("aria-label");

      // if user is not on arrayProfile then push
      arrayProfile.push({
        ID: arrLink[6],
        Name: name,
        Link: link,
      });
    }
  });

  // remove duplicate
  arrayProfile = arrayProfile.filter(
    (thing, index, self) =>
      index === self.findIndex((t) => t.Link === thing.Link)
  );

  return arrayProfile;
}

// when document ready
document.addEventListener("DOMContentLoaded", () => {
  const origin = window.origin;
  const href = window.location.href;
  const arrHref = href.split("/");
  const linkGroupMember = origin + `/groups/${arrHref[4]}/members/`;

  if (href === linkGroupMember) {
    chrome.runtime.sendMessage({ type: "ready" }, async (response) => {
      if (!response.data) {
        return;
      }

      let totalHeight = 0;
      const distance = 1000;

      // add loading
      document.body.insertAdjacentHTML(
        `beforeend`,
        `<div id="loading" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255,255,255,.60); z-index: 9999; display: flex; justify-content: center; align-items: center;"><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div></div>`
      );

      timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          const numberGet = getMemberList().length;

          chrome.runtime.sendMessage({ type: "numberGet", data: numberGet });
        }
      }, 1);
    });
  }
});
