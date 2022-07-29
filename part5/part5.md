### 5.01

The following workflow works: 1. apply role, account and binding. 2. apply deployment. 3. apply DummySite

### 5.02

Deployments are meshed:

![07a00905dcb2843bd03314080dd47d66](https://user-images.githubusercontent.com/74241142/181226634-baa965e5-818c-4275-8ec2-6de6c071ce0c.png)


### 5.03
![1](https://user-images.githubusercontent.com/74241142/181248093-2582dbc8-db87-471b-802a-bb42e884124b.png)

![2](https://user-images.githubusercontent.com/74241142/181248101-be5c413d-3553-48ed-a946-7f0acc886b00.png)

![3](https://user-images.githubusercontent.com/74241142/181248114-001d0993-26af-4482-964e-09462582d089.png)


### 5.04

### Rancher
- Open source
- Easier and faster installation
- More lightweight
- Not as complex as OpenShift
- Cheaper
- Follows and extends industry standards
- Multi-cluster managements stable for many years
- Smooth version updates
- Limited partners

### OpenShift
- Community version is open source, enterprise not
- Backed by Red Hat
- Installation may take over a week
- Favors own tools and practices = moving away from industry standards, vendor lock in
- More expensive
- Reported failed version updates
- IBM Partners

### 5.06

#### Red circle
- PostgreSQL, MSSQL, mongoDB used in web apps
- NATS used for queuing messages in project app
- HELM used for installing dependencies
- Argo used for canary releases
- Flux used for gitops
- Github Actions used for automation
- Jenkins used outside of the course
- K3s used by k3d
- Flagger used for automated canary releases
- GKE used in this course
- Heroku used outside of the course
- Knative used for serverless
- Kubernetes used in this course
- Linkerd used for service mesh
- GCR for images
- Prometheus used for monitoring
- Grafana used for monitoring
- Grafana loki used for monitoring

#### Orange circle
- CoreDNS dns server in kubernetes
- etcd key value database in kubernetes
- Traefik proxy used by k3s
- Google Persistent Disk for volumes in GKE
