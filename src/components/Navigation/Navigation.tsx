import React from "react";
import { ChevronDown, ChevronUp } from "react-feather";
import useWindowWidth from "../../hooks/useWindowWidth";
import "./navigation.css";
import NavigationAccount from "./NavigationAccount";
import NavigationBrand from "./NavigationBrand";
import NavigationLink from "./NavigationLink";

type INavProps = {
    connect: Function
}

const Navigation: React.FC<INavProps> = ({ connect }) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const width = useWindowWidth();

    return (
        <>
        <div className="navigation-bar">
            <div className="nav-content">
                <div className='nav-content-zone'>
                    <NavigationBrand />
                    {width > 800 &&
                        <>
                        <NavigationLink link="/" text="Home" />
                        <NavigationLink link="/pools" text="Pools" />
                        <NavigationLink link="/stake" text="Stake" />
                        <NavigationLink link="/swap" text="Swap" />
                        </>
                    }
                    {width < 800 &&
                        <div style={{display: 'flex', width: '40px', justifyContent: 'center', alignItems: 'center', marginLeft: '12px', cursor: 'pointer'}} onClick={() => setOpen(!open)}>
                        {!open && <ChevronDown size="24px" />}
                        {open && <ChevronUp size="24px" />}
                        </div>
                    }
                </div>
                <div className="nav-content-zone">
                    <NavigationAccount connect={(service: 'walletconnect' | 'injected') => connect(service)} />
                </div>
            </div>
        </div>
        <div className="mobile-nav-dropdown" style={{height: width < 800 && open ? '256px' : '0px', textAlign: 'center', transition: 'height ease-in-out 0.4s'}} onClick={() => setOpen(false)}>
            <>
                <NavigationLink link="/" text="Home" />
                <NavigationLink link="/pools" text="Pools" />
                <NavigationLink link="/stake" text="Stake" />
                <NavigationLink link="/swap" text="Swap" />
            </>
        </div>
        </>
    );
}

export default Navigation;