import React from "react";
import Whoarewe from "@/components/Whoarewe";
import Main from "@/components/Main";
import WorkFlow from "@/components/Workflow";
import Services from "@/components/Services";
import Counter from "@/components/Counter";
// import Slider from "@/components/Slider";
import Subscribe from "@/components/Subscribe";
import KWSCMap from "@/components/Kwscmap";
export default function Home() {
 

  return (
    <>
      <Main/>
      {/* <Slider /> */}
      <Whoarewe />
      <Services/>
      <WorkFlow />
      <Counter />
      <Subscribe />
     <KWSCMap />
    </>
  );
}
