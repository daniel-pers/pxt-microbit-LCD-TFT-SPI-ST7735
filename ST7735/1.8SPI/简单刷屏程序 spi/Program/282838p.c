
//     
/***************************************************/

#include<reg51.h>
#include<absacc.h>
#include<intrins.h>
#include<string.h>
#define uchar unsigned char
#define uint unsigned int

sbit cs        =P3^5;
sbit rs        =P2^3;
sbit sda       =P2^2;
sbit scl       =P2^1;
sbit reset     =P3^4;

uchar bdata bitdata;
sbit bit7=bitdata^7;
sbit bit6=bitdata^6;
sbit bit5=bitdata^5;
sbit bit4=bitdata^4;
sbit bit3=bitdata^3;
sbit bit2=bitdata^2;
sbit bit1=bitdata^1;
sbit bit0=bitdata^0;


void  delay(uint t);


void delay(uint time)
{
 uint i,j;
  for(i=0;i<time;i++)
   for(j=0;j<250;j++);
}




void LCD_CtrlWrite_IC(uchar c)
{
bitdata=c;
cs=0;
rs=0;
sda=bit7;scl=0;scl=1;
sda=bit6;scl=0;scl=1;
sda=bit5;scl=0;scl=1;
sda=bit4;scl=0;scl=1;
sda=bit3;scl=0;scl=1;
sda=bit2;scl=0;scl=1;
sda=bit1;scl=0;scl=1;
sda=bit0;scl=0;scl=1;
cs=1;


}
void  LCD_DataWrite_IC(uchar d)  
{

bitdata=d;
cs=0;
rs=1;
sda=bit7;scl=0;scl=1;
sda=bit6;scl=0;scl=1;
sda=bit5;scl=0;scl=1;
sda=bit4;scl=0;scl=1;
sda=bit3;scl=0;scl=1;
sda=bit2;scl=0;scl=1;
sda=bit1;scl=0;scl=1;
sda=bit0;scl=0;scl=1;
cs=1;
}

void LCD_DataWrite(uchar LCD_DataH,uchar LCD_DataL)
{
LCD_DataWrite_IC(LCD_DataH);
LCD_DataWrite_IC(LCD_DataL);
}


void  write_command(uchar c)
{
bitdata=c;
cs=0;
rs=0;
sda=bit7;scl=0;scl=1;
sda=bit6;scl=0;scl=1;
sda=bit5;scl=0;scl=1;
sda=bit4;scl=0;scl=1;
sda=bit3;scl=0;scl=1;
sda=bit2;scl=0;scl=1;
sda=bit1;scl=0;scl=1;
sda=bit0;scl=0;scl=1;
cs=1;      
}

void  write_data(uchar d)
{
bitdata=d;
cs=0;
rs=1;
sda=bit7;scl=0;scl=1;
sda=bit6;scl=0;scl=1;
sda=bit5;scl=0;scl=1;
sda=bit4;scl=0;scl=1;
sda=bit3;scl=0;scl=1;
sda=bit2;scl=0;scl=1;
sda=bit1;scl=0;scl=1;
sda=bit0;scl=0;scl=1;
cs=1;
}


void Reset()
{
    reset=0;
    delay(100);
    reset=1;
    delay(100);
}
//////////////////////////////////////////////////////////////////////////////////////////////

void lcd_initial()
{

   reset=0;
   delay(100);
   reset=1;
   delay(100);
 
//------------------------------------------------------------------//  
//-------------------Software Reset-------------------------------//
//------------------------------------------------------------------//


 write_command(0x11);//Sleep out
	delay(120);
	//ST7735R Frame Rate
	write_command(0xB1);
	write_data(0x01);
	write_data(0x2C);
	write_data(0x2D);
	write_command(0xB2);
	write_data(0x01);
	write_data(0x2C);
	write_data(0x2D);
	write_command(0xB3);
	write_data(0x01);
	write_data(0x2C);
	write_data(0x2D);
	write_data(0x01);
	write_data(0x2C);
	write_data(0x2D);
	//------------------------------------End ST7735R Frame Rate-----------------------------------------//
	write_command(0xB4);//Column inversion
	write_data(0x07);
	//------------------------------------ST7735R Power Sequence-----------------------------------------//
	write_command(0xC0);
	write_data(0xA2);
	write_data(0x02);
	write_data(0x84);
	write_command(0xC1);
	write_data(0xC5);
	write_command(0xC2);
	write_data(0x0A);
	write_data(0x00);
	write_command(0xC3);
	write_data(0x8A);
	write_data(0x2A);
	write_command(0xC4);
	write_data(0x8A);
	write_data(0xEE);
	//---------------------------------End ST7735R Power Sequence-------------------------------------//
	write_command(0xC5);//VCOM
	write_data(0x0E);
	write_command(0x36);//MX, MY, RGB mode
	write_data(0xC8);
	//------------------------------------ST7735R Gamma Sequence-----------------------------------------//
	write_command(0xe0);
	write_data(0x02);
	write_data(0x1c);
	write_data(0x07);
	write_data(0x12);
	write_data(0x37);
	write_data(0x32);
	write_data(0x29);
	write_data(0x2d);
	write_data(0x29);
	write_data(0x25);
	write_data(0x2b);
	write_data(0x39);
	write_data(0x00);
	write_data(0x01);
	write_data(0x03);
	write_data(0x10);
	write_command(0xe1);
	write_data(0x03);
	write_data(0x1d);
	write_data(0x07);
	write_data(0x06);
	write_data(0x2e);
	write_data(0x2c);
	write_data(0x29);
	write_data(0x2d);
	write_data(0x2e);
	write_data(0x2e);
	write_data(0x37);
	write_data(0x3f);
	write_data(0x00);
	write_data(0x00);
	write_data(0x02);
	write_data(0x10);
	 write_command(0x2A);
   write_data(0x00);
   write_data(0x02);
   write_data(0x00);
   write_data(0x81);
  
   write_command(0x2B);
   write_data(0x00);
   write_data(0x01);
   write_data(0x00);
   write_data(0xA0);
	//------------------------------------End ST7735R Gamma Sequence-----------------------------------------//

    write_command(0x3A); 
    write_data(0x05);  
	//write_command(0x3A);//65k mode
	//write_data(0x05);
	write_command(0x29);//Display on
}




void dsp_single_colour(DH,DL)
{
 uchar i,j;
 //RamAdressSet();
 for (i=0;i<160;i++)
    for (j=0;j<128;j++)
        LCD_DataWrite(DH,DL);
}



main()
{
 lcd_initial();

      while(1)
  {
 write_command(0x2C);
  //  Disp_gradscal(); //灰阶
   // delay(500); 
      
//    dsp_single_colour(0x84,0x10);//灰色
//    delay(500);	

    dsp_single_colour(0xff,0xff);//白色
    delay(500);	
    	
    dsp_single_colour(0x00,0x00);//黑色
    delay(500);	
    	
    dsp_single_colour(0xf8,0x00);//红色
    delay(500);	
    	
    dsp_single_colour(0x07,0xe0);//绿色
    delay(500);	
    	
    dsp_single_colour(0x00,0x1f);//蓝色
    delay(500);	

    }

 }



