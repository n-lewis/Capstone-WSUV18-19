<template>
  <div id="left-bar">
    <div id="collapse-expand" @click="collapsed = !collapsed">
      <i class="material-icons">{{ (collapsed) ? 'chevron_right' : 'chevron_left' }}</i>
    </div>
    <div class="content" :class="{ collapsed }">
      <div class="clearfix">
        <span class="btn btn-secondary btn-sm logout--button" @click="logout">Log Out</span>
        <span
          v-if="selectedDocument"
          class="btn btn-secondary btn-sm back--button"
          @click="back()"
        >&#8701; Back</span>
        <h1>Print View</h1>
      </div>
      <div v-if="!selectedDocument" class="clearfix">
        <div class="card partner-app--table">
          <div class="card-header">
            <h3 class="lead">All Uploaded Prints</h3>
          </div>
          <div class="card-body">
            <table id="t1" class="table table-hover">
              <div>
                <thead>
                  <tr>
                    <th style="width: 32%">Name</th>
                    <th style="width: 12%">Pages</th>
                    <th style="width: 32%">Date Added</th>
                    <th style="width: 12%"></th>
                    <th style="width: 12%"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(imageGroup, index) in imageGroups"
                    :key="imageGroup.id"
                    :value="imageGroup.id"
                  >
                    <td style="width: 32%">{{imageGroup.name}}</td>
                    <td style="width: 12%">
                      <div v-if="typeof imageGroup.metadata === 'undefined'">
                        Nan</div>
                      <div v-else>{{ imageGroup.metadata.Pages }}</div>
                    </td>
                    <td style="width: 32%">{{imageGroup.created}}</td>
                    <td style="width: 12%">
                      <input
                        class="btn btn-primary btn-sm hp-color"
                        @click="selectImageGroup(imageGroup, index)"
                        type="submit"
                        value="show"
                      >
                    </td>
                    <td style="width: 12%">
                      <input
                        class="btn btn-outline-danger btn-sm"
                        @click="deleteEntry(index)"
                        type="submit"
                        value="Delete"
                      >
                    </td>
                  </tr>
                </tbody>
              </div>
            </table>
          </div>
        </div>
        <div class="card partner-app--table">
          <div class="card-header">
            <h3 class="lead">Upload New Print</h3>
          </div>
          <div class="card-body">
            <form>
              <div class="custom-file">
                <input type="file" class="custom-file-input" id="pdf" @change="updateLabel">
                <label class="custom-file-label" for="pdf">{{chosenFile}}</label>
              </div>
            </form>
            <input
              :disabled="!uploadEnabled"
              v-bind:class="[activeClass]"
              @click="upload"
              type="submit"
              value="Upload"
            >
          </div>
        </div>
      </div>
      <div v-else class="clearfix" style="min-width: 500px;">
        <div class="card partner-app--table">
          <div class="card-header">
            <h3 class="lead">Print 3d Visualization</h3>
            <h6 >{{chosenFile}}</h6>
          </div>
          <div class="card-body">
            <h5>Select Template</h5>
            <select class="form-control " v-model="selectedTemplate" v-on:input="templateSwitch($event)">
              <optgroup label="Templates">
                <option value="0" selected>Select an option</option>
                <option value="1">Card</option>
                <option value="2">Half Fold</option>
                <option value="3">Gate Fold</option>
                <option value="4">Tri Fold</option>
                <option value="5">Z fold</option>
                <option value="6">Accordion Fold</option>
              </optgroup>
            </select>
            <h5 class="pt-4">Adjust Fold</h5>
            <input
                    type="range"
                    id="myRangeGate"
                    min="0"
                    max="1"
                    step=".01"
                    v-model="sliderValue"
                    style="display: block; margin: 0 auto; width: 50%;"
            >
            <div>
              <span class="partner-app-upload--button btn-primary btn" @click="deleteObjects">Clear</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HalfFold from "../threejs/templates/halffold";
import GateFold from "../threejs/templates/gatefold";
import Card from "../threejs/templates/card";
import TriFold from "../threejs/templates/trifold";
import ZFold from "../threejs/templates/zfold";
import AccordionFold from "../threejs/templates/accordionfold";
import Magazine from "../threejs/templates/magazine"

import PdfImage from "../threejs/pdfImage";
import PdfImageGroup from "../threejs/pdfImageGroup";


export default {
  name: "LeftBar",
  data() {
    return {
      viewState: "select", // select || edit
      collapsed: false,
      selectedDocument: false,
      selectedTemplate: 0,
      sliderEnabled: false,
      sliderValue: 0,
      chosenFile: "Choose File",
      fileDisplayed: "None",
      selectedImageGroupId: null,
      imageGroups: [],
      currentImageGroup: [],
      activeClass: "btn btn-primary partner-app-upload--button",
      uploadEnabled: true
    };
  },
  watch: {
    sliderValue: function(val) {
      this.$store.getters.currentDrawnObject.setPercentFold(val);
    }
  },
  mounted() {
    fetch("/db-connector/getImageGroups")
      .then(raw => raw.json())
      .then(result => {
        this.imageGroups = result.results;
        if (this.imageGroups) {
          for (let i = 0; i < this.imageGroups.length; i++) {
            // wow, bad
            let date = new Date(this.imageGroups[i].created);
            let month =  ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
            let day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
            this.imageGroups[i].created = `${date.getFullYear()}/${month}/${day}`;
            this.imageGroups[i].metadata = JSON.parse(
              this.imageGroups[i].metadata
            );
          }
        }
      })
      .catch(err => console.error(err));
  },
  methods: {
    updateLabel() {
      this.chosenFile = document.getElementById("pdf").files[0].name;
    },
    logout() {
      this.$store.dispatch("logout");
    },
    createCard() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new Card(this.$store.getters.canvas, this.currentImageGroup.images)
      );
    },
    createHalfFold() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new HalfFold(this.$store.getters.canvas, this.currentImageGroup.images)
      );
    },
    createGateFold() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new GateFold(this.$store.getters.canvas, this.currentImageGroup.images)
      );
    },
    createTriFold() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new TriFold(this.$store.getters.canvas, this.currentImageGroup.images)
      );
    },
    createZFold() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new ZFold(this.$store.getters.canvas, this.currentImageGroup.images)
      );
    },
    createAccordionFold() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new AccordionFold(
          this.$store.getters.canvas,
          this.currentImageGroup.images
        )
      );
    },
    createMagazine() {
      this.sliderValue = 0;
      this.$store.commit(
        "SET_CURRENT_DRAWN_OBJECT",
        new Magazine(
          this.$store.getters.canvas,
          this.currentImageGroup.images
        )
      );
    },
    deleteEntry(imageIndex) {
      fetch(
        `/db-connector/deleteImageGroup/${this.imageGroups[imageIndex].id}`,
        {
          method: "POST"
        }
      )
        .then(raw => {
          return raw.json();
        })
        .then(res => {
          //console.log(res);
        })
        .catch(err => {
          console.error("Failed to delete");
        });
      this.imageGroups.splice(imageIndex, 1);
    },
    back() {
      this.deleteObjects();
      this.selectedTemplate = 0;
      this.selectedDocument = false;
    },
    deleteObjects() {
      this.$store.getters.canvas.deleteObjects();
    },
    upload() {
      const pdfList = document.getElementById("pdf").files;

      if (!pdfList.length) {
        return;
      } else {
        this.uploadEnabled = false;
        this.activeClass = "btn btn-primary partner-app-upload-clicked--button";
      }

      const pdf = pdfList[0];
      const pdfName = pdfList[0].name;

      fetch("/db-connector/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/pdf",
          "PDF-Name": pdfName
        },
        body: pdf
      })
        .then(raw => {
          //update image groups and re-enable button
          this.updateImageGroups();
          return raw.json();
        })
        .then(res => {
          //console.log(res);
        })
        .catch(err => {
          console.error("Failed to upload the pdf");
        })
        .finally(() => {
          // re-enable
          this.uploadEnabled = true;
          this.activeClass = "btn btn-primary partner-app-upload--button";
        });
    },
    selectImageGroup(imageGroup, index) {
      fetch(`/db-connector/getImageGroup/${imageGroup.id}`)
        .then(raw => raw.json())
        .then(result => {
          this.selectedDocument = true;
          this.currentImageGroup = new PdfImageGroup(
            imageGroup,
            result.results
          );
          console.log(this.currentImageGroup);
          this.chosenFile = this.imageGroups[index].name;
          if (this.currentImageGroup === -1) {
            alert("Invalid imageGroup");
            return;
          }
        })
        .catch(err => {
          console.error(err);
        });
      // this.createCard();
    },
    templateSwitch(event) {
      let id = parseInt(event.target.value);
      this.sliderEnabled = true;

      if(id === 1){
        this.sliderEnabled = false;
        this.createCard()
      }else if(id === 2){
        this.createHalfFold()
      }else if(id === 3){
        this.createGateFold()
      }else if(id === 4){
        this.createTriFold()
      }else if(id === 5){
        this.createZFold()
      }else if(id === 6){
        this.createAccordionFold()
      }
    },
    updateImageGroups() {
      fetch("/db-connector/getImageGroups")
        .then(raw => raw.json())
        .then(result => {
          this.imageGroups = result.results;
          if (this.imageGroups) {
            // this should REALLY be a computed property
            for (let i = 0; i < this.imageGroups.length; i++) {
              let date = new Date(this.imageGroups[i].created);
              let month =  ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`
              let day = (date.getDate() < 10) ? `0${date.getDate()}` : `${date.getDate()}`;
              this.imageGroups[i].created = `${date.getFullYear()}/${month}/${day}`
              this.imageGroups[i].metadata = JSON.parse(
                this.imageGroups[i].metadata
              );
            }
          }
        })
        .catch(err => console.error(err));
    }
  }
};
</script>
