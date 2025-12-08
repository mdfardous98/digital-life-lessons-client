import { useState, useEffect } from "react";
import useAxios from "./useAxios";

const useLessons = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        const res = await axios.get(url);
        if (isMounted) {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [url, axios]);

  return { data, loading };
};

export default useLessons;
