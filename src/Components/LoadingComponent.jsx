  const fetchItems = (query = "") => {
    setLoading(true); // Show loading spinner
    const url = query
      ? `http://localhost:4000/search?q=${query}`
      : "http://localhost:4000/";
    axios
      .get(url)
      .then((result) => {
        const data = Array.isArray(result.data) ? result.data : [];
        setItems(data);
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false)); // Hide spinner after fetch
  };

  if (loading) {
    return <LoadingComponent message="Fetching data, please wait..." />;
  }
