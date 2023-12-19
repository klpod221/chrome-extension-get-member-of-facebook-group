<template>
  <div class="extension">
    <header class="header">
      <h1>Get FB Group Members</h1>
    </header>
    <div class="container">
      <div v-if="!isAtFBGroup">
        <p>Please go to a Facebook group and click the extension icon again.</p>
      </div>

      <div v-else>
        <button v-if="!processing" class="btn" @click="getMembers">
          <span class="circle" aria-hidden="true">
            <span class="icon arrow"></span>
          </span>
          <span class="btn-text">Get members</span>
        </button>

        <template v-else>
          <button class="btn" @click="exportMembers">
            <span class="circle" aria-hidden="true">
              <span class="icon arrow"></span>
            </span>
            <span class="btn-text">Export members</span>
          </button>

          <div class="popup-loading">
            <p>Processed</p>
            <h2>{{ numberOfProcessing }} members</h2>
            <div class="spinner">
              <div class="bubble-1"></div>
              <div class="bubble-2"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
const XLSX = require("xlsx");

export default {
  name: "App",
  data() {
    return {
      isAtFBGroup: false,
      groupSlug: "",
      processing: false,
      numberOfProcessing: 0,
      members: [],
      XLSX: null,
    };
  },
  mounted() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url;
      if (url.includes("facebook.com/groups")) {
        this.isAtFBGroup = true;
        this.groupSlug = url.split("/")[4];
      }
    });

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const type = request.type;

      switch (type) {
        case "ready":
          sendResponse({ data: this.groupSlug });
          break;
        case "exportMembers":
          this.members = request.data;
          this.exportToExcel();
          this.processing = false;
          this.numberOfProcessing = 0;
          sendResponse({ received: true });
          break;
        case "numberGet":
          this.numberOfProcessing = request.data;
          this.processing = true;
          sendResponse({ received: true });
          break;
        default:
          break;
      }
    });
  },
  methods: {
    getMembers() {
      this.processing = true;

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { trigger: true });
      });
    },
    exportMembers() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { export: true });
      });
    },
    exportToExcel() {
      if (!XLSX) {
        alert("XLSX is not defined");
      }

      const ws = XLSX.utils.json_to_sheet(this.members);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Members");
      XLSX.writeFile(wb, `${this.groupSlug}-members.xlsx`);
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  background: #fff;
  font-family: sans-serif;
  font-size: 0.8rem;
  min-width: 30rem;
}

.header {
  align-items: center;
  height: 4rem;
  display: flex;
  background: #4266b1;

  h1 {
    width: 100%;
    text-align: center;
    color: #fff;
  }
}

.container {
  min-height: 5rem;
  padding: 1.5rem;
}

p {
  font-size: 16px;
}

.extension {
  min-width: 300px;
  text-align: center;
}

.load-wrap p {
  padding: 0 0 20px;
}
.load-wrap:last-child {
  margin-right: 0;
}

.load-9 {
  animation-delay: 1.44s;
}

.popup-loading .spinner {
  animation: loadingI 2s linear infinite;
}
.popup-loading .bubble-1,
.popup-loading .bubble-2 {
  animation: bounce 2s ease-in-out infinite;
}
.popup-loading .bubble-2 {
  animation-delay: -1s;
}

.spinner {
  position: relative;
  width: 45px;
  height: 45px;
  margin: 0 auto;
}

.bubble-1,
.bubble-2 {
  position: absolute;
  top: 0;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  background-color: #4b9cdb;
}

.bubble-2 {
  top: auto;
  bottom: 0;
}

.popup-loading .spinner {
  animation: loadingI 2s linear infinite;
}
.popup-loading .bubble-1,
.popup-loading .bubble-2 {
  animation: bounce 2s ease-in-out infinite;
}
.popup-loading .bubble-2 {
  animation-delay: -1s;
}

.popup-loading p {
  font-size: 25px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  color: #4b9cdb;
}

@keyframes loadingI {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
}

// Css button
@import url("https://fonts.googleapis.com/css?family=Mukta:700");

$bg: #f3f8fa;
$white: #fff;
$black: #282936;

@mixin transition(
  $property: all,
  $duration: 0.45s,
  $ease: cubic-bezier(0.65, 0, 0.076, 1)
) {
  transition: $property $duration $ease;
}

* {
  box-sizing: border-box;
  &::before,
  &::after {
    box-sizing: border-box;
  }
}

button {
  position: relative;
  display: inline-block;
  cursor: pointer;
  outline: none;
  border: 0;
  vertical-align: middle;
  text-decoration: none;
  background: transparent;
  padding: 0;
  font-size: inherit;
  font-family: inherit;
  &.btn {
    width: 12rem;
    height: auto;
    .circle {
      @include transition(all, 0.45s, cubic-bezier(0.65, 0, 0.076, 1));
      position: relative;
      display: block;
      margin: 0;
      width: 3rem;
      height: 3rem;
      background: $black;
      border-radius: 1.625rem;
      .icon {
        @include transition(all, 0.45s, cubic-bezier(0.65, 0, 0.076, 1));
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        background: $white;
        &.arrow {
          @include transition(all, 0.45s, cubic-bezier(0.65, 0, 0.076, 1));
          left: 1.2rem;
          width: 0.125rem;
          height: 1.125rem;
          background: none;
          transform: rotate(-90deg);
          background: none;
          &::before {
            position: absolute;
            content: "";
            top: 0.45rem;
            left: -0.25rem;
            width: 0.625rem;
            height: 0.625rem;
            border-bottom: 0.125rem solid #fff;
            border-right: 0.125rem solid #fff;
            -webkit-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        }
      }
    }
    .btn-text {
      @include transition(all, 0.45s, cubic-bezier(0.65, 0, 0.076, 1));
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 0.75rem 0;
      margin: 0 0 0 1.85rem;
      color: $black;
      font-weight: 700;
      line-height: 1.6;
      text-align: center;
      text-transform: uppercase;
    }
  }
  &:hover {
    .circle {
      width: 100%;
      .icon {
        &.arrow {
          background: $white;
          transform: translate(1rem, 0);
        }
      }
    }
    .btn-text {
      color: $white;
    }
  }
}
</style>
