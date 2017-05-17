# NZZ Storytelling Q Renderer Service Skeleton

Q tool skeleton to help you creating a new Q tool. Clone or download this repo, change it according to your needs and push to your own new remote repo.
See also [Q server documentation - Developing tools](https://nzzdev.github.io/Q-server/developing-tools.html)

## Docker setup
Dockerfile already included in skeleton repo. Renderer service can be dockerized locally with:
* `docker build -t q-renderer-name .`
* `docker run -p 3000:3000 q-renderer-name`
For more information see [Docker documentaion](https://docs.docker.com/)

## Travis Setup
Travis needs the following environment variables (can be set in Travis' GUI) to push docker image and update rancher accordingly:
* `DOCKER_USERNAME`
* `DOCKER_EMAIL`
* `DOCKER_PASSWORD`
* `RANCHER_URL`
* `CATTLE_ACCESS_KEY`
* `CATTLE_SECRET_KEY`
* `RANCHER_SERVICE_ID_STAGING`

To add slack notifications for your builds execute the following command with the suitable token:
* `travis encrypt "nzzstorytelling:token" --add notifications.slack`
 
