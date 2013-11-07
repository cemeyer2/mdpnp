# spike in ruby to see if we can talk to pumps
# run sudo gem install ruby-serialport to get the gem
# on OSX, the shipped version of rubygems is too old, so to update
# run "sudo gem install rubygems-update" then "sudo update_rubygems"
# testing push to maggie
require 'rubygems'
require 'serialport'

def serial_read(sp)
  val = 0
  while val != 2
   val = sp.getc
  end
  val = sp.getc
  retval = ""
  while val != 3
   val = sp.getc
   retval = retval + val.chr
  end
  return retval
end

def serial_write(sp, command)
  sp.write command+"\r"
end

sp = SerialPort.new("/dev/tty.PL2303-0000103D")

sp.baud = 19200
sp.flow_control = SerialPort::NONE
sp.data_bits = 8
sp.stop_bits = 1
sp.parity = SerialPort::NONE
sp.read_timeout = 1

serial_write(sp, "RUN")
puts serial_read(sp)

sleep 3

serial_write(sp,"STP")
puts serial_read(sp)

sp.close
