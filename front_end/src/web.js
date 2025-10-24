const reportWeb = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      //1
      getCLS(onPerfEntry);
//2
      getFID(onPerfEntry);
//3
      getFCP(onPerfEntry);
//4
      getLCP(onPerfEntry);
//5
      getTTFB(onPerfEntry);

      //end
    });
  }
};

//end
export default reportWeb;
