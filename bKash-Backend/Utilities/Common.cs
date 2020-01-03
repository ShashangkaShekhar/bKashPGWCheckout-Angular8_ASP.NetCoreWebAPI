using System;
using System.Linq;

namespace Utilities
{
    public static class Common
    {
        static Random random = new Random();
        public static string genRandomNumber(int length)
        {
            string rndm = string.Empty;
            try
            {
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                rndm = new string(Enumerable.Repeat(chars, length).Select(x => x[random.Next(x.Length)]).ToArray());
            }
            catch (Exception) { }
            return rndm;
        }
    }
}
