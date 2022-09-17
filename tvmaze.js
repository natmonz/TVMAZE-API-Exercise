
const missingImage = "https://tinyurl.com/tv-missing"

// this function requests data from the API using AJAX request and returns the shows typed in the query.
async function searchShows(query) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`)
    let shows = response.data.map(result => {
        let show = result.show;
        return  {

          id: show.id,
          name: show.name,
          summary: show.summary,
          image: show.image ? show.image.medium : missingImage,

        };
    });
    return shows;
};


// creates a list of shows and pushes them into the DOM.
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
   for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
            <img class ="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

// A handle click where the search button initializes the search of shows from the searchShows query.
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
      if (!query) return;
   $("#episodes-area").hide();
  let shows = await searchShows(query);
  
  populateShows(shows);
});

// This function returns episodes/data from the API to which can be used in the populateEpisodes function
async function getEpisodes(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = response.data.map(episode => ({

    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,

  }));
  return episodes;
}

// This function creates the episode list and pushes it into the DOM!
function populateEpisodes(episodes) {
  const $episodesList = $('#episodes-list');
  $episodesList.empty();
    for (let episode of episodes) {
      let $item = $(
        `<li> ${episode.name} (season ${episode.season}, episode ${episode.number}) </li>`
  );
  $episodesList.append($item);
};
  $('#episodes-area').show();
}

// click handler for the episode button.
$('#shows-list').on('click', '.get-episodes', async function handleEpisodeClick(e) {
  let showId = $(e.target).closest('.Show').data('show-id');
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
})
