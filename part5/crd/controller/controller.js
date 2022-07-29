import k8s from '@kubernetes/client-node'
import axios from 'axios'
import request from 'request'

const kc = new k8s.KubeConfig()
kc.loadFromDefault()

const k8sApi = kc.makeApiClient(k8s.CoreV1Api)
const k8sApiNetworking = kc.makeApiClient(k8s.NetworkingV1Api)

const createDummySite = (url) => {
    axios.get(url)
        .then(function (response) {
            createResources(response.data)
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
}

const createResources = (data) => {
    k8sApiNetworking.createNamespacedIngress("default", {
			apiVersions: "networking.k8s.io/v1",
			kind: "Ingress",
			metadata: {
				name: "ingress",
			},
			spec: {
				rules: [
					{
						http: {
							paths: [
								{
									backend: {
										service: {
											name: "website-svc",
											port: {
												name: "http",
											},
										},
									},
                                    path: "/",
									pathType: "Prefix",
								},
							],
						},
					},
				],
			},
		})
		.catch((err) => console.error(err));

    k8sApi.createNamespacedService("default", {
			apiVersion: "v1",
			kind: "Service",
			metadata: {
				name: "website-svc",
			},
			spec: {
				type: "ClusterIP",
				selector: {
					app: "website",
				},
				ports: [
					{
						name: "http",
						port: 4000,
						protocol: "TCP",
						targetPort: 4000,
					},
				],
			},
		})
		.catch((err) => console.error(err))
    
    k8sApi.createNamespacedPod("default", {
			apiVersion: "v1",
			kind: "Pod",
			metadata: {
				name: "website-pod",
				labels: {
					app: "website",
				},
			},
			spec: {
				containers: [
					{
						name: "website",
						image: "tonip57/website",
						env: [
							{
								name: "WEBSITE",
								value: data,
							},
						],
						ports: [
							{
								name: "http",
								containerPort: 4000,
								protocol: "TCP",
							},
						],
					},
				],
			},
		})
		.catch((err) => console.error(err))
}

const options = {}
kc.applyToRequest(options)

const main = () => {
	console.log("Checking if DummySite exists..")
	console.log(kc.getCurrentCluster().server)
    request.get(`${kc.getCurrentCluster().server}/apis/tonip57.dwk/v1/dummysites`, options,
    (error, response, body) => {
        if (error) {
            console.log(`error: ${error}`)
        }
        if (response) {
			console.log(response)
            console.log(`statusCode: ${response.statusCode}`)
        }
        const json = JSON.parse(body)
		if (json.items !== undefined) {
			if (json.items.length !== 0) {
        	const url = JSON.stringify(json.items[0].spec.website_url)
        		console.log(url)
        		createDummySite(url.replaceAll('"', ''))
			}
		}
    })
	setTimeout(main, 4000)
}

main()