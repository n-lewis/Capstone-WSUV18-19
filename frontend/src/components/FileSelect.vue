<template>
  <div class="clearfix">
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
              <tr v-for="(imageGroup, index) in imageGroups" :key="index" :value="imageGroup.id">
                <td style="width: 32%">{{imageGroup.name}}</td>
                <td style="width: 12%">{{imageGroup.metadata.Pages}}</td>
                <td style="width: 32%">{{imageGroup.created}}</td>
                <td style="width: 12%">
                  <input
                    class="btn btn-primary btn-sm hp-color"
                    @click="$store.dispatch('selectImageGroup', { imageGroup, index })"
                    type="submit"
                    value="show"
                  >
                </td>
                <td style="width: 12%">
                  <input
                    class="btn btn-outline-danger btn-sm"
                    @click="$store.dispatch('deleteEntry', index)"
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
</template>

<script>
export default {
  name: "FileSelect",
  computed: {
    imageGroup() {
      return this.$store.getters.imageGroup;
    }
  }
};
</script>
