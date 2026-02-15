function StepperDemo() {
    const steps = ["Step A", "Step B", "Step C"];
    return(
        <div className="flex ">
          {steps.map((step , idx)=>  {
            const stepnumber = idx + 1;
            
            return(
            <div className="
            w-[200px]
            relative
            flex flex-col justify-center items-center
            [&:not(:first-child)]:before:h-[3px] [&:not(:first-child)]:before:w-full
            [&:not(:first-child)]:before:absolute
            [&:not(:first-child)]:before:right-1/2 [&:not(:first-child)]:before:top-1/3
            [&:not(:first-child)]:before:translate-y-1
            [&:not(:first-child)]:before:bg-primary" 
            key={idx}>

              <div className="
                flex items-center
                rounded-full
                 z-10 
                 w-10 h-10
                 font-semibold
                 bg-primary text-primary-foreground">

                
            {stepnumber}
             </div>  
              <div className="
              text-sa
              mt-2
              font-medium
              text-foreground">
                {step}
              </div>
              </div>
            );
            })}     
        </div>

    );    
 }

