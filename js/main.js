const user_repos = $("#user_repos");
const status = $("#status");

function repos_url(user, page = 1) {
	return `https://api.github.com/users/${user}/repos?sort=updated&page=${page}`;
}

function start_loading(selector) {
	const dimmers = $(selector || ".dimmer");
	dimmers.addClass("active");
}
function stop_loading(selector) {
	const dimmers = $(selector || ".dimmer");
	dimmers.removeClass("active");
}

function fetchUserRepos(user, page = 1) {
	const url = repos_url(user, page);
	if (page === 1) user_repos.html("");
	start_loading();
	$.get(url, function(repos) {
		if (!repos) return false;
		for (let repo of repos) {
			const item = $(
				`<a class="ui item" href="${repo.html_url}" target="_blank">${
					repo.name
				}<small> | Modifié le : ${moment(repo.updated_at).format('DD MMMM YYYY')}</small></a>`
			);
			user_repos.append(item);
		}
		if (repos.length === 30) return fetchUserRepos(user, page + 1);
		return stop_loading();
	});
}

function checkLastStatus() {
	const url =
		"https://api.github.com/repos/demorite/demorite.github.io/pages/builds/latest";
	$.get(url, function(response) {
		status.html(
			response.status +
				" : " +
				moment(response.updated_at).format("DD/MM/YYYY hh:mm")
		);
	});
}

window.addEventListener("load", () => {
	checkLastStatus();
	fetchUserRepos("demorite");
});
