# encoding:utf-8

from numpy import int16 as npint16
from numpy import empty as npempty
from numpy import ceil as npceil
from numpy import cos as npcos
from numpy import sin as npsin
from numpy import pi as nppi
from numpy import zeros as npzeros
from numpy import multiply as npmultiply
from numpy import append as npappend
from numpy import max as npmax
from numpy import argmax as npargmax
from numpy import abs as npabs
from scipy.io.wavfile import write, read
# from traceback import print_exc as tracebackprint_exec
# from os.path import exists as ospathexists
from os import chdir
# import traceback
import sys


class StimSig:
    """
    Signal ultrasonore STIMSHOP, dont les symboles
    sont de fréquence centrale fc, de largeur de bande B et de temps
    symbole T, pour une fréquence d'échantillonnage fe.
    Modes :
        - 0 = UCheck.in
        - 1 = Wi-Us (non fait encore)



    NOTICE D'UTILISATION:
        1) importer ou faire un run de ce fichier Stimshop_generator
        2) créer l'objet signal avec les paramètres de base, tel que : sig = Stimshop_generator(fc, B, T, fe, mode)
        3) générer un signal correspondant à un message et créer le fichier wav correspondant, tel que : sig.make_wav("EF002", filename.wav", interval, repetition, volume)

    Si les paramètres initiaux restent inchangés, on peut répéter l'opérations 3) autant de fois que nécessaire pour créer autant de signaux que souhaité.
    """

    def __init__(self, fc, B, T, fe, mode):
        try:
            if int != (type(fc) or type(B) or type(T) or type(fe)):
                raise IntParamError
            if mode < 0 or mode > 1:
                raise SigModeError
            # Attributs publiques
            self.fc = fc
            self.B = B
            self.T = T
            self.fe = fe
            self.mode = mode
            # Attributs privés
            self.__A = 1
            self.__T_lg = int(4 * self.T)
            self.__bit_per_symb = 4
            self.__char_per_mess = 5
            self.__nb_useful_bits = self.__bit_per_symb * self.__char_per_mess
            self.__hex_param = 16
            self.__int_param = 2
            self.__start_stop = 10
            self.__left_table = [1100, 1110, 10001, 10011, 10101, 10111,
                                 1001, 1011, 1101, 1111, 10000, 10010, 10100, 10110, 1000, 1010]
            self.__right_table = [10001, 10011, 10110, 1000, 1010, 1100,
                                  1110, 10000, 10010, 10100, 10101, 10111, 1001, 1011, 1101, 1111]
            self.__wav_param = 32767
            self.__param_alpha = 0.5
            self.__overlap_fact = 0
            self.__hamming_adds = [4, 8]
            self.__fn_gen_wav = ""
        except IntParamError:
            print("Parameters must be intergers !")
        except SigModeError:
            print("Signal mode must be 0 or 1 !")

    """
    ----------------------------------------------------------------------------------------------------
                Méthodes privées
    ----------------------------------------------------------------------------------------------------
    """

    def __hexa_to_int(self, source_h):
        """ Convert an hexadecimal string into an integer
        @param: source_h    -> str: hexa to convert
        @return: res_i      -> int: converted integer """
        res_i = int(source_h, self.__hex_param)
        # print('__hexa_to_int src = ' + str(source_h) + ' - res = ' + str(res_i))
        return res_i

    def __int_to_hexa(self, source_i):
        """ Convert an integer into a hexadecimal string
        @param: source_i    -> str: int to convert
        @return: res_h      -> int: converted hexa """
        res_h = hex(source_i)[self.__int_param:]
        # print('__int_to_hexa src = ' + str(source_i) + ' - res = ' + str(res_h))

        return res_h.upper()

    def __parity_bits_compute(self):
        """ Compute the number of parity bits needed
        @return: r          -> int: number of parity bits needed for m useful bits """
        m = self.__nb_useful_bits
        r = 0
        for i in range(m):
            if (2 ** i >= m + i + 1):
                r = i
                break
        # print('__parity_bits_compute = ' + str(r))
        return r

    def __hamming_encode(self, data):
        """ Encode a sequence of bit with extended hamming error detection
        @param: data        -> str: int to convert
        @return: res        -> list: useful bit and parity bits
        @return: nb_pbits   -> int: total number of parity bits """
        m = self.__nb_useful_bits
        j, k = 0, 0
        r = self.__parity_bits_compute()
        res = []
        for i in range(m + r):
            if (i + 1 == 2 ** j):
                res.append(0)
                j += 1
            else:
                res.append(data[k])
                k += 1
        # print("res1 = " + repr(res))
        n = len(res)
        for i in range(r):
            val = 0
            for j in range(n):
                if ((j + 1) & (2 ** i) == (2 ** i)):
                    val ^= int(res[j])
            res[2**i - 1] = val
        # print("res2 = " + repr(res))
        for occu in self.__hamming_adds:
            # print("occu = " + str(occu))
            val = 0
            for i in range(0, n, occu):
                val ^= res[i]
            res.append(val)
        # print("res3 = " + repr(res))
        nb_pbits = r + len(self.__hamming_adds)
        # print('__hamming_encode : res = ' +
        #   repr(res) + ' nb_pbits = ' + str(nb_pbits))
        return res, nb_pbits

    def __slice_num(self, num):
        """ Slice a pattern into a list of 0 and 1 for conversion
        @param: num         -> int: pattern from conversion table to slice
        @return: res        -> list: sliced bits """
        res = [num // 10**3 % 10, num // 10**2 %
               10, num // 10**1 % 10, num // 10**0 % 10]
        # print('__slice_num num = ' + str(num) + ' res = ' + str(res))
        return res

    def __encode_message(self, code):
        """ Encode an hexadecimal message into a sequence of bits
        @param: code        -> str: string to convert
        @return: res        -> list: converted bytes """
        size = len(code)
        res = npempty(self.__bit_per_symb * size, int)
        count = 0
        if (size & 1 == 1):
            lim = (size + 1) // 2
        else:
            lim = (size + 2) // 2
        # print("lim = ", lim)
        for i in range(size):
            index = self.__hexa_to_int(code[i])
            [ind1, ind2, ind3, ind4] = self.__slice_num(
                self.__left_table[index]) if i < lim else self.__slice_num(self.__right_table[index])
            res[count:count + self.__bit_per_symb] = ind1, ind2, ind3, ind4
            count += self.__bit_per_symb
        # print("res = " + repr(res))
        res_hamming, nb_par_bits = self.__hamming_encode(res)
        return res_hamming, nb_par_bits

    def __tukey_window(self, nb_samples):
        """ Create a Tukey window
        @param: nb_samples  -> int: size of the window
        @return: tukey_win  -> list: the tukey window"""
        di = int(npceil(nb_samples * self.__param_alpha))
        hann_win = npempty(di, float)
        # print("di = " + str(di))
        for i in range(di):
            nv = (0.5 * (1 - npcos(2 * nppi * i / (di - 1))))
            hann_win[i] = nv
            # if i > 500 and i < 550:
            #     print('nv(' + str(i) + ') = ' + str(nv))

        # print("hann_win = " + repr(hann_win))
        lim = int(npceil(di / 2))
        tukey_win = npempty(nb_samples, float)
        tukey_win[0:lim] = hann_win[0:lim]
        tukey_win[lim:nb_samples - lim] = 1
        tukey_win[nb_samples-lim:nb_samples] = hann_win[di - lim:di]
        # print("tukey_win = " + repr(tukey_win))
        return tukey_win

    def __one_shot(self, is_up, T):
        """ Create a chirp
        @param: is_up       -> bool: True for up chirp, False for down chirp
        @param: T           -> int: duration of the chirp
        @return: res        -> list: chirp """
        wc = self.fc * 2 * nppi / self.fe
        # print("wc = " + str(wc))
        B_rad = self.B * 2 * nppi / self.fe
        # print("B_rad = " + str(B_rad))
        chirp = npzeros(T, float)
        phase = 0.0
        slope = 1 if is_up else -1
        for i in range(T):
            nv = self.__A * npsin(phase)
            chirp[i] = nv
            phase += slope * B_rad / T * (i + 0.5 * (1 - T)) + wc
        # print("chirp = " + str(chirp))
        env = self.__tukey_window(T)
        res = npmultiply(chirp, env)
        max = res.max()
        print("max = " + str(max))
        res = res / max

        # for i in range(50):
        #     print('res[' + str(300+i) + '] = ' + str(res[300+i]))
        return res

    def __createSignal(self, message):
        """ Create a signal of chirps, with a synchronisation symbol, regarding a sequence of bits
        @param: message         -> str: hexa message to encode
        @param: overlap_fact    -> float: percentage of overlap between each symbol"""
        T_lg = self.T * 4
        first_blank = self.T
        buf_message, nb_par_bits = self.__encode_message(message)

        # print(buf_message)
        # q = input("Wanna change the sequence ? (y/n) : ")
        # if q == "y":
        #     ind = np.int(input("Enter the index you wanna change : "))
        #     buf_message[ind] = 0 if buf_message[ind] == 1 else 1
        # print(f"Out sequence :\n{buf_message}")

        buf_long_chirp = self.__one_shot(True, self.__T_lg)
        print("len(buf_long_chirp) = " + str(len(buf_long_chirp)))
        buf_low_chirp = self.__one_shot(False, self.T)
        # print("buf_low_chirp = " + repr(buf_low_chirp))
        buf_high_chirp = self.__one_shot(True, self.T)
        # print("buf_high_chirp = " + repr(buf_high_chirp))
        nb_symbole = len(message) * self.__bit_per_symb + nb_par_bits
        mess_size = nb_symbole * self.T
        overlap_size = round(self.T * self.__overlap_fact)
        self.__buffer_size = first_blank + self.__T_lg + \
            mess_size - overlap_size * (nb_symbole - 1)
        self.__buffer_sig = npzeros(self.__buffer_size, float)
        count = first_blank + self.__T_lg
        self.__buffer_sig[count - self.__T_lg: count] = buf_long_chirp
        for i in range(nb_symbole):
            self.__buffer_sig[count: count +
                              self.T] += buf_high_chirp if buf_message[i] == 1 else buf_low_chirp
            count += self.T - overlap_size

        # f = open("signal.txt", "w+")
        # for i in range(self.__buffer_size):
        #     f.write(f"{self.__buffer_sig[i]}\n")
        # f.close()
        return

    """
    ----------------------------------------------------------------------------------------------------
                Méthodes publiques
    ----------------------------------------------------------------------------------------------------
    """

    def make_and_export(self, message, interval, repeat, volume):
        """ Create a signal, composed of one or many messages and export it in wav format
        @param: message     -> str: hexa message to encode
        @param: interval    -> int: length between two signal in milliseconds
        @param: repeat      -> int: signal repetitions
        @param: volume      -> float: volume of the wav"""
        self.__createSignal(message)
        try:
            if repeat < 1:
                raise RepeatValueError
            if volume > 1 or volume < 0:
                raise VolumeValueError
            interv_spl = int(interval / 1000 * self.fe)
            print("interv_spl = " + str(interv_spl))
            print("self.__buffer_size = " + str(self.__buffer_size))
            size = self.__buffer_size + interv_spl
            print("size = " + str(size))
            size_total = size * repeat
            # size + (interv_spl + size) * (repeat - 1)
            print("size total = " + str(size_total))
            sig_to_convert = npzeros(size_total)
            for i in range(repeat):
                start = size * i
                end = size * i + self.__buffer_size
                sig_to_convert[start: end] = self.__buffer_sig
            scaled = npint16(sig_to_convert * volume /
                             npmax(npabs(sig_to_convert)) * self.__wav_param)
            print("scaled = " + repr(scaled))
            cnt_dir = 0
            is_file = True
            is_first = True
            # while is_file: #Génération d'un fichier v1, v2, v3
            #     if ospathexists(self.__fn_gen_wav):
            #         cnt_dir += 1
            #         if cnt_dir == 1 :
            #             self.__fn_gen_wav = self.__fn_gen_wav[0 : -4] + f"_v{cnt_dir}" + self.__fn_gen_wav[-4::]
            #         else:
            #             if cnt_dir < 10 :
            #                 self.__fn_gen_wav = self.__fn_gen_wav[0 : -7] + f"_v{cnt_dir}" + self.__fn_gen_wav[-4::]
            #             else:
            #                 self.__fn_gen_wav = self.__fn_gen_wav[0 : -8] + f"_v{cnt_dir}" + self.__fn_gen_wav[-4::]
            #     else:
            #         is_file = False
            write(self.__fn_gen_wav, self.fe, scaled)
        except RepeatValueError:
            print("Repetition must be at least 1")
        except VolumeValueError:
            print("Volume must between 0 and 1")
        # except (OSError, IndexError, TypeError, NameError, ValueError):
            # traceback.print_exc()

    def get_fn_gen(self):
        """ Get the file name of the generated wav file """
        return self.__fn_gen_wav

    def set_fn_gen(self, fn):
        """ Set the file name of the generated wav file
        @param: fn          -> str: name to set"""
        self.__fn_gen_wav = fn


class Error(Exception):
    pass


class SigModeError(Error):
    pass


class IntParamError(Error):
    pass


class RepeatValueError(Error):
    pass


class VolumeValueError(Error):
    pass


B = 1000
T = 1024


print(sys.argv)
if (len(sys.argv) < 2):
    mess_val = "15973"
else:
    mess_val = sys.argv[1]

if (len(sys.argv) < 3):
    centralFreq = 19.5
else:
    centralFreq = float(sys.argv[2])

if (len(sys.argv) < 4):
    sampleFreq = 48
else:
    sampleFreq = int(sys.argv[3])

if (len(sys.argv) < 5):
    interval = 500
else:
    interval = int(sys.argv[4])

if (len(sys.argv) < 6):
    repeats = 10
else:
    repeats = int(sys.argv[5])

if (len(sys.argv) <= 7):
    volume = 80
else:
    volume = int(sys.argv[6])


# print(f"Message {mess_val} has been generated. Parameters : fc={centralFreq}, B={B}, T={T} at fe={sampleFreq}")


# python UcheckIn_Parameters.py 15973 19.5 48 500 10 80
# chdir("/www/googleWebhook/tokens")
sig = StimSig(int(float(centralFreq) * 1000), B,
              T, int(float(sampleFreq) * 1000), 0)
sig.set_fn_gen(mess_val+".wav")
sig.make_and_export(mess_val, interval, repeats, volume / 100)
