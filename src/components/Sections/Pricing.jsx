import React from "react";
import styled from "styled-components";
// Components
import PricingTable from "../Elements/PricingTable";

export default function Pricing() {
  return (
    <Wrapper id="pricing">
      <div className="whiteBg">
        <div className="container">
          <HeaderInfo>
            <h1 className="font40 extraBold">Our Pricing</h1>
            <p className="font13">
              Explore our clear and competitive pricing models for mobile app and website development. Tailored to your needs,
              <br />
              our options ensure quality and affordability, helping you achieve your digital goals efficiently.
            </p>
          </HeaderInfo>
          <TablesWrapper className="flexSpaceNull">
            <TableBox>
              <PricingTable
                icon="mobile"
                price="$10,000+"
                title="Mobile"
                text="Comprehensive mobile app pricing includes design, development, and ongoing support for Android, iOS, or both platforms."
                offers={[
                  { name: "Android", cheked: true },
                  { name: "iOS", cheked: true },
                  { name: "Web", cheked: false },
                  { name: "Support", cheked: true },
                  { name: "Publishing", cheked: true },
                ]}
                action={() => alert("clicked")}
              />
            </TableBox>
            <TableBox>
              <PricingTable
                icon="monitor"
                price="$1000+"
                title="Website"
                text="Website pricing covers design, development, and ongoing support, ensuring your site is crafted and maintained for optimal performance and user engagement."
                offers={[
                  { name: "Android", cheked: false },
                  { name: "iOS", cheked: false },
                  { name: "Web", cheked: true },
                  { name: "Support", cheked: true },
                  { name: "Hosting", cheked: true },
                ]}
                action={() => alert("clicked")}
              />
            </TableBox>
            <TableBox>
              <PricingTable
                icon="crossPlatform"
                price="$15,000+"
                title="Cross-platform"
                text="Cross-platform pricing encompasses comprehensive design, development, and continuous support across all platforms, providing a unified solution for maximum reach and impact."
                offers={[
                  { name: "Android", cheked: true },
                  { name: "iOS", cheked: true },
                  { name: "Web", cheked: true },
                  { name: "Support", cheked: true },
                  { name: "Publishing/Hosting", cheked: true },
                ]}
                action={() => alert("clicked")}
              />
            </TableBox>
          </TablesWrapper>
          <p>Don't hesitate to cantact us for any special requests such as app refactoring, app migration (iOS &lt;-&gt; Android), web migration to mobile etc.</p>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.section`
  width: 100%;
  padding: 50px 0;
`;
const HeaderInfo = styled.div`
  margin-bottom: 50px;
  @media (max-width: 860px) {
    text-align: center;
  }
`;
const TablesWrapper = styled.div`
  @media (max-width: 860px) {
    flex-direction: column;
  }
`;
const TableBox = styled.div`
  width: 31%;
  @media (max-width: 860px) {
    width: 100%;
    max-width: 370px;
    margin: 0 auto
  }
`;




