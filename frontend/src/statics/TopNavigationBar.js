import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { indexerClient, myAlgoConnect } from "../utils";

const TopNavigationBar = () => {
  const [balance, setBalance] = useState(0);

  const walletAddress = localStorage.getItem("address");

  const setMyBalance = async () => {
    const myAccountInfo = await indexerClient
      .lookupAccountByID(walletAddress)
      .do();

    const b = myAccountInfo.account.amount / 1000000;
    setBalance(b);
  };

  useEffect(() => {
    if (!!walletAddress) {
      setMyBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const AlgoConnect = async () => {
    try {
      const accounts = await myAlgoConnect.connect({
        shouldSelectOneAccount: true,
      });
      const address = accounts[0].address;

      // close modal.
      localStorage.setItem("wallet-type", "my-algo");
      localStorage.setItem("address", address);

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const algoSignerConnect = async () => {
    try {
      if (typeof window.AlgoSigner === "undefined") {
        window.open(
          "https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm",
          "_blank"
        );
      } else {
        console.log(window.AlgoSigner.accounts);
        await window.AlgoSigner.connect({
          ledger: "TestNet",
        });
        const accounts = await window.AlgoSigner.accounts({
          ledger: "TestNet",
        });

        const address = accounts[0].address;

        // close modal.
        localStorage.setItem("wallet-type", "algosigner");
        localStorage.setItem("address", address);

        window.location.reload();
      }
    } catch (error) {
      alert("AlgoSigner not set up yet!");
    }
  };

  const isWalletConnected =
    localStorage.getItem("wallet-type") === null ? false : true;

  return (
    <header className="small_header">
      <div className="small_header_inn">
        <div className="top_logo">
          <img src="/img/department_logo.jpeg" alt="" />
          <p>NACOS VOTING PLATFORM</p>
        </div>

        {!!isWalletConnected ? (
          <div className="addrDisplay">
            <div className="addrDisplayInn">
              <div className="addrBalance">
                <span className="reloadBalance" onClick={setMyBalance}></span>
                {balance} $ALGO
              </div>

              <CopyToClipboard text={walletAddress}>
                <div className="addressTxt">
                  <p>{walletAddress}</p>
                  <i className="uil uil-copy"></i>
                </div>
              </CopyToClipboard>
            </div>
          </div>
        ) : (
          <div className="dropDownConnect">
            <div className="dropDownConnect_button">
              <button
                className="connect_wallet_button"
                //
                onClick={AlgoConnect}
              >
                <p>
                  Connect Wallet
                  {/* <i
                    className="uil uil-angle-down"
                    style={{ fontSize: "18px" }}
                  /> */}
                </p>
              </button>
            </div>

            {/* <div className="dropDownConnect_items">
              <div className="dropDownConnect_item" onClick={myAlgoConnect}>
                <div className="dropDownConnect_img">
                  <img
                    src="https://i.postimg.cc/76r9kXSr/My-Algo-Logo-4c21daa4.png"
                    alt=""
                  />
                </div>
                <p className="dropDownConnect_item_txt">My Algo Wallet</p>
              </div>
              <div className="dropDownConnect_item" onClick={algoSignerConnect}>
                <div className="dropDownConnect_img">
                  <img
                    src="https://i.postimg.cc/L4JB4JwT/Algo-Signer-2ec35000.png"
                    alt=""
                  />
                </div>
                <p className="dropDownConnect_item_txt">
                  {typeof window.AlgoSigner === undefined
                    ? "Install AlgoSigner"
                    : "AlgoSigner"}
                </p>
              </div>
            </div> */}
          </div>
        )}
        {/*  */}
      </div>
    </header>
  );
};

export default TopNavigationBar;
