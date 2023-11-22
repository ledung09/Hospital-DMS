"use client";
import {  HiOutlineChevronDown } from "react-icons/hi";
import Button from "react-bootstrap/Button";
import Dropdown from 'react-bootstrap/Dropdown';
import React from 'react';


export default function ButtonExplore() {
  const CustomToggle = React.forwardRef(({ onClick } : { onClick: any }, ref : any) => (
    <Button 
      variant="primary" 
      className="h-[38px] ml-6 mr-2" 
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <div className="flex items-center gap-x-2">
        <p>Explore</p>
        <HiOutlineChevronDown />
      </div>
    </Button>
  ));
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
      </Dropdown.Toggle>
      <Dropdown.Menu className="" style={{width: "fit-content"}}>
        <div className="m-6 flex flex-col gap-y-3">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-primary text-2xl font-semibold">Course By Subject</h3>
            <p className="text-primary text-sm">View all subjects {'>>'}</p>
          </div>
          <div className="flex g-x-6">
            <p className="text-xs leading-6 w-44">Artificial Intelligence <br/> Python <br/> Data Science <br/> Finance <br/> Machine Learning <br/> Computer Programming <br/> Data Analysis <br/> SQL <br/> Business Administration</p>
            <p className="text-xs leading-6 w-44">Leadership <br/> Economics <br/> Statistics <br/> Writing <br/> Sales <br/> Psychology <br/> Biology <br/> JavaScript <br/> Supply Chain Management</p>
            <p className="text-xs leading-6 w-44">R <br/> Algorithms <br/> Physics <br/> Marketing <br/> Linux <br/> C <br/> Spanish <br/> Probability <br/> Data Structures</p>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}
