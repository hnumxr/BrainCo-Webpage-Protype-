
from socket import *
from threading import *
import struct
import os
import time
from ButterworthFilter import *
from scipy.fftpack import fft

#HOST = 'localhost'
HOST = '192.168.1.108'
PORT = 8899
BUF_SIZE = 1                            # read 1 bytes from socket every time

FSC = 4642997
BETA = 1.8202
OFC = -7085
ALPHA = 0x3E8000
V_REF = 2.5
PGA = 64


class Router(Thread):
    head = []                           # array buffer storing 4 bytes last received for detect whether it is head
    tail = []                           # array buffer storing 4 bytes last received for detect whether it is tail
    body = []                           # array buffer storing 60 int
    body_c = []                         # array buffer stroing 60 calculated int
    body_ele = []                       # array buffer storing 4 bytes last received for convert to int
    body_filter = []
    body_fft = []
    body_fft_result = []
    body_fft_re_real = []
    body_fft_re_imag = []
    current_path = ''
    filename = '/Users/Rhea/my_project/BrainCO/backend/c.txt'

    def __int__(self):
        pass

    def run(self):
        self.current_path = os.path.abspath('.')
        self.filename = self.current_path + '/c.txt'
        try:
            self.s = socket(AF_INET, SOCK_STREAM)
        except:
            print("fail to build up socket")
            sys.exit()
        print("build socket successfully")
        while True:
            while True:
                try:
                    print("waiting")
                    self.s.connect((HOST, PORT))
                    print("connect success")
                    break
                except:
                    # time.sleep(1)
                    continue
            while True:
                try:
                    data = self.s.recv(BUF_SIZE)
                except:
                    break
                    # continue
                if data:
                    if (self.detectHead(data)):                 # empty all array buffer when detect head or tail
                        self.cleanArray()
                    elif (self.detectTail(data)):
                        self.dosomething()
                        self.cleanArray()
                    else:
                        self.decode(data)

    def dosomething(self):                                       # do somethin when received package of full 60 int
        nc_int_filter = filterloop(self.body_c)
        self.writefile(nc_int_filter)
        # if (len(self.body_fft) >= 300):
        #     self.body_fft = self.body_fft[60:300]
        #     self.body_fft.extend(nc_int_filter)
        #     self.body_fft_result = fft(self.body_fft)
        #     self.seperate_complexe()
        #     #print(self.body_fft_result)
        #     #self.test_complexe()
        #
        #     attentionLevel = self.clc_attn(self.body_fft_re_real, self.body_fft_re_imag)
        #     print(attentionLevel)
        # else:
        #     self.body_fft.extend(nc_int_filter)

    def decode(self, data):
        self.body_ele.append(data)
        if (len(self.body_ele) < 4):
            return False
        else:
            b_str = ''.join(self.body_ele)
            n_int = struct.unpack('i', b_str)
            self.body.append(n_int[0])
            nc_int = self.canculate(n_int[0])
            self.body_c.append(nc_int)
            #self.writefile(nc_int)
            self.body_ele = []
            return True

    def canculate(self, data):
        result = (data * 1.0 / FSC / BETA + OFC * 1.0 / ALPHA) * 2 * V_REF / PGA * 1000000
        return result

    def writefile(self, data):
        f = open(self.filename, 'w')
        temp_str = ''
        for i in range(60):
            if i % 2 == 0:
                temp_str += str(i) + ' '
            else:
                temp_str += str(i * -1) + ' '
        #for i in range(len(data)):
        #    temp_str += str(data[i]) + ' '
        #temp_str += str(100000000) + ' '
        f.write(temp_str)
        f.close()

    def cleanArray(self):
        self.head = []
        self.tail = []
        self.body = []
        self.body_c = []
        self.body_ele = []
        self.body_filter = []
        self.body_fft_re_real = []
        self.body_fft_re_imag = []

    def detectHead(self, piece):
        self.head.append(piece)
        if (len(self.head) < 4):
            return False
        else:
            if (self.head[0] == '\xff' and self.head[1] == '\xff' and self.head[2] == '\xff' and self.head[3] == '\x7f'):
                self.head = self.head[1:4]
                return True
            else:
                self.head = self.head[1:4]
                return False

    def detectTail(self, piece):
        self.tail.append(piece)
        if (len(self.tail) < 4):
            return False
        else:
            if (self.tail[0] == '\xff' and self.tail[1] == '\xff' and self.tail[2] == '\xff' and self.tail[3] == '\x6f'):
                self.tail = self.tail[1:4]
                return True
            else:
                self.tail = self.tail[1:4]
                return False

    def clc_attn(self, input_fft_re_real, input_fft_re_imag, input_size=300, low_alpha=5.0, high_alpha=8.0, low_beta=8.0, high_beta=20.0, sample_rate=60):
        alpha = 0;
        beta = 0;

        output_frequency_Re = input_fft_re_real
        zero_imag = input_fft_re_imag

        low_alpha_i = round(low_alpha * input_size / sample_rate)
        high_alpha_i = round(high_alpha * input_size / sample_rate)
        low_beta_i = round(low_beta * input_size / sample_rate)
        high_beta_i = round(high_beta * input_size / sample_rate)

        for i in range(int(low_alpha_i), int(high_alpha_i + 1), 1):
            alpha += output_frequency_Re[i] ** 2 + zero_imag[i] ** 2

        for i in range(int(low_beta_i), int(high_beta_i + 1), 1):
            beta += output_frequency_Re[i] ** 2 + zero_imag[i] ** 2

        alpha /= high_alpha_i - low_alpha_i + 1;
        beta /= high_beta_i - low_beta_i + 1;

        result = round(100 * beta / alpha)

        return result

    def seperate_complexe(self):
        for i in range(len(self.body_fft_result)):
            self.body_fft_re_real.append(self.body_fft_result[i].real)
            self.body_fft_re_imag.append(self.body_fft_result[i].imag)

r = Router()
r.start()

