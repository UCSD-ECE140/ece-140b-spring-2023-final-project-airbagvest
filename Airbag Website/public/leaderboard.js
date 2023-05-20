document.addEventListener("DOMContentLoaded", (event) => {

  // Define the 'request' function to handle interactions with the server
  function server_request(url, data = {}, verb, callback) {
    return fetch(url, {
      credentials: 'same-origin',
      method: verb,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
      .then(response => response.json())
      .then(function (response) {
        if (callback)
          callback(response);
      })
      .catch(error => console.error('Error:', error));
  }

  var leadContainer = document.querySelector("#lcontain");
  var comContainer = document.querySelector("#ccontain");
  var teams = [];
  var teamViews = [];
  var commentViews = [];


  
  function showLeaderboard() {
    leadContainer.innerHTML = `Loading...`;
    comContainer.innerHTML = `Choose a idea to see the comments of!`;
    fetch(`https://slidespace.icu/api/sections`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
      })
      .then(async (dataHold) => {
        if (dataHold.length <= 0) {
          return {};
        }
        var i = 0;
        var section = 1;
        dataHold = JSON.parse(dataHold["sections"]);
        var totalTeams = 0;
        teams.push([])
        fetches = [];
        for (data in dataHold) {
          i++;
          fetches.push(await fetch(`https://slidespace.icu/api/sections/${i}/teams`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
              }
              return response.json();
            })
            .then((dataHold) => {
              if (dataHold.length <= 0) {
                return {};
              }
              dataHold = JSON.parse(dataHold["names"]);
              for (data in dataHold) {
                teams.push([])
                teams[totalTeams + 1].push(section);
                totalTeams++;
              }
              section++;
            })
            .catch(error => console.error('Error:', error))
          );

        }
        await Promise.all(fetches).then(function () {
          console.log(totalTeams);
        });
        /*for (var j = 0; j <= totalTeams; j++) {
          teams.push([])
        }*/
        var fetches = [];
        var teamsIndex = 0;
        var scoresIndex = 1;
        for (var k = 1; k <= totalTeams; k++) {
          fetches.push(await fetch(`https://slidespace.icu/api/teams/${k}`)
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
              }
              var teamData = await response.json();
              teamData = JSON.parse(teamData["team"]);
              teams[teamData["id"]].push(teamData);
            })
            .catch(error => console.error('Error:', error))
          );
          await Promise.all(fetches).then(function () {
            console.log(teams);
            fetches = [];
          });
          fetches.push(fetch(`https://slidespace.icu/api/teams/${k}/scores`)
            .then(async (response) => {
              if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
              }
              var scoreData = await response.json();
              scoreData = JSON.parse(scoreData["scores"]);
              teams[k - 1].push(scoreData);
            })
          );
        }
        leadContainer.innerHTML = ``;
        await Promise.all(fetches).then(function () {
          console.log(teams);
          //sort teams by score?
          var teamsSpliced = teams.splice(0,1);
          console.log(teamsSpliced);
          console.log(teams);
          var sortedArray = teams.sort(function(a, b) {
            var avgA = 0;
            var avgB = 0;
            dataA = a["2"]
            dataB = b["2"]
            for(var dataAIndex = 0; dataAIndex < dataA.length; dataAIndex++){
              avgA = dataA["topic_"+dataAIndex]
            }
            for(var dataBIndex = 0; dataBIndex < dataB.length; dataBIndex++){
              avgB = dataB["topic_"+dataBIndex]
            }
            return  avgA - avgB;
          });
          console.log(sortedArray);
          sortedArray.splice(0,0,[]);
          teams = sortedArray
          console.log(teams);
          var teamIndex = 1;
          for (var team in teams) {
            if (teamIndex > teams.length - 1) {
              break;
            }
            // Display MVP Ideas
            var teamInfo = document.createElement("div");
            //show teams and ideas w/ section
            teamInfo.innerHTML = `
            <h2>Rank: ${teamIndex}</h2>
            <h2>Team Name: ${teams[teamIndex]["1"]["name"]}</h2>
            <p>Members: ${teams[teamIndex]["1"]["members"]}</p>
            <span>Team ID: </span>
            <span class="teamID">${teams[teamIndex]["1"]["id"]}</span>
            <div></div>
            <span>Section ID: </span>
            <span class="sectionID">${teams[teamIndex]["0"]}</span>
            <div></div>
            <button class="commentBtn link">
              Comments 
            </button>
            <button style = "display: none" class="backBtn link">
              Back 
            </button>
            <form class = "add_form" style = "display: none;" name = "add_form" action ="http://localhost:6543/addComment" method="POST">
              <input type="text" class = "addInput" placeholder="Write your new comment here! (max 1k characters)" maxlength="1000" size="50"></input>
              <input class = "link" value = "Add" type = "submit"></input>
            </form>`;

            leadContainer.appendChild(teamInfo);
            teamViews.push(teamInfo);
            teamIndex++;
            teamInfo.querySelector(".commentBtn").addEventListener("click", (event) => {
              parent = event.currentTarget.parentElement;
              num = parent.querySelector(".teamID").innerHTML;
              for (var teamViewNum = 0; teamViewNum < teamViews.length; teamViewNum++) {
                console.log(teamViews[teamViewNum])
                if (teamViews[teamViewNum].querySelector(".teamID").innerHTML != num) {
                  teamViews[teamViewNum].style = "display: none";
                }
              }
              backBtn = parent.querySelector(".backBtn");
              backBtn.style = "display: inline";
              var addForm = parent.querySelector(".add_form");
              addForm.style = "display: inline";
              url = `http://localhost:6543/comments/${num}`;
              comContainer.innerHTML = `Loading...`;
              //get and show comments
              fetch(url)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                  }
                  return response.json();
                })
                .then((data) => {
                  // Display MVP Ideas
                  console.log(data);
                  comContainer.innerHTML = ``
                  for (var c = 0; c < data.length; c++) {
                    var commentInfo = document.createElement("div");
                    commentInfo.innerHTML = `
                    <h2><span>Comment:<span> 
                    <span class = "comment">${data[c][2]}</span></h2>
                    <p></p>
                    <span>Comment ID: </span>
                    <span class="commentID">${data[c][0]}</span>
                    <div><div>
                    <span>Project ID: </span>
                    <span class="projectID">${data[c][1]}</span>
                    <div></div>
                    `;
                    comContainer.appendChild(commentInfo);
                    commentViews.push(commentInfo);
                  }
                  fetch(url + "/user")
                    .then((response) => {
                      if (!response.ok) {
                        throw new Error(`HTTP Error: ${response.status}`);
                      }
                      return response.json();
                    })
                    .then((data) => {
                      var dataIndex = 0;
                      for (var d = 0; d < commentViews.length; d++) {
                        if (dataIndex >= data.length) {
                          break;
                        }
                        //add edit delete
                        if (Number(commentViews[d].querySelector(".commentID").innerHTML) == data[dataIndex][1]) {
                          dataIndex++;
                          var commentEditDelete = document.createElement("div");
                          commentEditDelete.innerHTML = `
                            <div>Want to change your comment? Write your new comment in the box below then hit the Edit button!</div>
                            <input type="text" class = "editInput" placeholder="Write your new comment here! (max 1k characters)" maxlength="1000" size="50"></input>
                            <div></div>
                            <button class="editBtn link">
                              Edit 
                            </button>
                            <button class="deleteBtn link">
                              Delete 
                            </button>
                            `;
                          commentViews[d].appendChild(commentEditDelete);
                          commentViews[d].querySelector(".editBtn").addEventListener("click", (event) => {
                            url = "http://localhost:6543/updateComment"
                            data = {
                              "comment": event.currentTarget.parentElement.querySelector(".editInput").value,
                              "comment_id": event.currentTarget.parentElement.parentElement.querySelector(".commentID").innerHTML
                            }
                            server_request(url, data, "POST", (response) => {
                              alert(response.message);
                              if (response.changed) {
                                alert("Go back from the comments and reopen them to see your updates!")
                                //change comment on page if have time
                              }
                            });
                          });
                          commentViews[d].querySelector(".deleteBtn").addEventListener("click", (event) => {
                            url = "http://localhost:6543/deleteComment"
                            data = {
                              "comment": event.currentTarget.parentElement.parentElement.querySelector(".comment").innerHTML,
                              "comment_id": event.currentTarget.parentElement.parentElement.querySelector(".commentID").innerHTML
                            }
                            server_request(url, data, "DELETE", (response) => {
                              alert(response.message);
                              if (response.changed) {
                                event.originalTarget.parentElement.parentElement.style = "display:none"
                              }
                            });

                          });

                        }
                      }
                    });
                  backBtn = parent.querySelector(".backBtn");
                  backBtn.style = "display: inline"
                  backBtn.addEventListener("click", (event) => {
                    for (var teamViewNum = 0; teamViewNum < teamViews.length; teamViewNum++) {
                      console.log(teamViews[teamViewNum])
                      if (teamViews[teamViewNum].querySelector(".teamID").innerHTML != num) {
                        teamViews[teamViewNum].style = "display: inline";
                      }
                    }
                    event.currentTarget.style = "display: none";
                    addForm = event.currentTarget.parentElement.querySelector(".add_form");
                    removeEventListener("submit", addForm);
                    addForm.style = "display: none";
                    commentViews = [];
                    comContainer.innerHTML = ``;
                    //delete comments
                  });
                });
                addForm.addEventListener('submit', (event) => {
                  // Stop the default form behavior
                  event.preventDefault();
                  // Grab the needed form fields
                  const action = addForm.getAttribute('action');
                  const method = addForm.getAttribute('method');
                  var data = {
                    "comment": event.currentTarget.querySelector(".addInput").value,
                    "project_id": Number(event.currentTarget.parentElement.querySelector(".teamID").innerHTML)
                  }
                  console.log(data);
                  server_request(action, data, method, (response) => {
                    alert(response.message);
                    if (response.changed) {
                      alert("Go back from the comments and reopen them to see your updates!")
                      //add comment to page if have time
                    }
                  });
                });
            });
          }
          //sort then show leaderboard});
        })
          .catch(error => console.error('Error:', error));
      });
  }
  showLeaderboard();
});

