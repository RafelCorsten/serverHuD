import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getIndServer } from "../../services/api";
import { Layout } from "antd";

const { Header, Footer, Sider, Content } = Layout;

const ServerInfo = (props: any) => {
  interface IServer {
    name: string;
    sslExpiry: number;
    sslStatus: string;
    status: string;
    url: string;
  }
  const [serverData, setServerData] = useState<IServer>({
    name: "",
    sslExpiry: 0,
    sslStatus: "",
    status: "",
    url: "",
  });

  const location = useLocation();
  var parts = location.pathname.split("/");
  var paramStr = parts[parts.length - 1];
  useEffect(() => {
    getIndServer(paramStr).then((e: any) => {
      setServerData(e.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <Content>
        Name: {serverData.name}
        URL: {serverData.url}
        Status: {serverData.status}
        SSL: {serverData.sslStatus}
        SSL Expires: {serverData.sslExpiry}
      </Content>
    </Layout>
  );
};

export default ServerInfo;
