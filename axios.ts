const instance : AxiosInstance = Axios.create({
    baseURL: "http://127.0.0.1:3300/" + (client || ""),
    params: { ts: new Date().getDate() },
});

instance.interceptors.request.use(request => request, (error) => {
    console.log("Erro request", error);

    window.location.hash = "/errors/500";
    return Promise.reject(error);
});

instance.interceptors.response.use(response => response, (error) => {
    console.log("Erro response", error);

    window.location.hash = "/errors/500";
    return Promise.reject(error);
});
