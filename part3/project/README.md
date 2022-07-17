### 3.06

#### DBaaS
Pros
+ Professional experts doing the maintaining and updating
+ Often better security
+ Backups and replication are easier to setup
+ Good for companies that do not have experts in this field
+ Easier to scale

Cons
- Costly on this project
- Vendor lock-in

#### DIY
Pros
+ No vendor lock-in
+ Cheaper in this project
+ Easier to debug

Cons
- Maintaining ja updating is more time consuming
- Backups and replication have to be done by yourself
- Scaling is more complicated

### 3.07

I decided to use Postgres with PersistentVolumeClaims in my project. I chose this one because it has already been done and I didn't want to get stuck on new things.

### 3.10

![screenshot](https://user-images.githubusercontent.com/74241142/178103599-53573283-a032-4ba1-a3d0-b3e3bcff44fb.png)

#### main.yaml
name: Release application

on:
  push:


env:
  PROJECT_ID: ${{ secrets.GKE_PROJECT }}
  GKE_CLUSTER: dwk-cluster
  GKE_ZONE: europe-north1-c
  IMAGE: backend

jobs:
  setup-build-publish-deploy:
    name: Setup, Build, Publish, and Deploy
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - id: 'auth'
        uses: 'google-github-actions/auth@v0'
        with:
          credentials_json: '${{ secrets.GKE_SA_KEY }}'

      - name: 'Set up Cloud SDK'
        uses: 'google-github-actions/setup-gcloud@v0'

      # Configure Docker to use the gcloud command-line tool as a credential
      # helper for authentication
      - run: |-
          gcloud --quiet auth configure-docker
      # Get the GKE credentials so we can deploy to the cluster
      - run: |-
          gcloud container clusters get-credentials dwk-cluster --zone europe-north1-c
      # Build the Docker image
      - name: Build
        run: |-
          docker build \
            --tag "gcr.io/$PROJECT_ID/$IMAGE:${GITHUB_REF#refs/heads/}-latest" --no-cache \
            .
      # Push the Docker image to Google Container Registry
      - name: Publish
        run: |-
          docker push "gcr.io/$PROJECT_ID/$IMAGE:${GITHUB_REF#refs/heads/}-latest"
      # Set up kustomize
      - name: Set up Kustomize
        uses: imranismail/setup-kustomize@v1

      # Deploy the Docker image to the GKE cluster
      - name: Deploy
        run: |-
          kubectl create namespace ${GITHUB_REF#refs/heads/} || true
          kubectl config set-context --current --namespace=${GITHUB_REF#refs/heads/}
          kustomize edit set namespace ${GITHUB_REF#refs/heads/}
          kustomize edit set image gcr.io/PROJECT_ID/IMAGE=gcr.io/$PROJECT_ID/$IMAGE:${GITHUB_REF#refs/heads/}-latest
          kubectl apply -k .
          kubectl rollout status deployment $IMAGE

#### delete.yaml


name: Delete environment on branch deletion

on: delete
  
jobs:
  delete_environment:
    if: github.event.ref_type == 'branch'
    name: Delete environment
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - id: 'auth'
        uses: 'google-github-actions/auth@v0'
        with:
          credentials_json: '${{ secrets.GKE_SA_KEY }}'

      - name: 'Set up Cloud SDK'
        uses: 'google-github-actions/setup-gcloud@v0'

      # Get the GKE credentials so we can deploy to the cluster
      - run: |-
          gcloud container clusters get-credentials dwk-cluster --zone europe-north1-c
      # Delete environment
      - name: Delete
        run: |-
          kubectl delete all --all -n ${{ github.event.ref }}
