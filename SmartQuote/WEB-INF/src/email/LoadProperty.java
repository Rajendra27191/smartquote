package email;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

public class LoadProperty {
	
/*-------- Method loadProperty() --------------*/
	
	public Properties loadMailProperty(String path)
	{
		Properties fileprop= new Properties();
		try 
			{
			 System.out.println("Path On JAVA: "+ path + File.separator+"mailProp.property");
				//fileprop.load(LoadProperty.class.getResourceAsStream(path+File.separator+"mailProp.property"));
				File f = new File(path+File.separator+"mailProp.property");
				FileInputStream fis = new FileInputStream(f);
				fileprop = new Properties();
				fileprop.load(fis);
				fis.close();
				System.out.println("File Read Successfully....!");
			}
		catch (FileNotFoundException e) 
			{			
				e.printStackTrace();
			} 
		catch (IOException e) 
			{			
				e.printStackTrace();
			}
		catch (Exception e) {
			e.printStackTrace();
		}
		return fileprop;
	}	// end of method loadProperty()
	
	public Properties getPropertyFile(String path){
        Properties objmProperties=null;
        FileInputStream objmFileInputStream=null;
        try {
            File objmFile = new File(path+File.separator+"mailProp.property");
            System.out.println("Path On JAVA: "+ path+File.separator+"mailProp.property");
            objmFileInputStream = new FileInputStream(objmFile);
            objmProperties = new Properties();
            objmProperties.load(objmFileInputStream);
        }catch (Exception ex){
            System.out.println("Exception in readProperties");
            ex.printStackTrace();
        }finally{
            try {
                objmFileInputStream.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return objmProperties;
    }
}
