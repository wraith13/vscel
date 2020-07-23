import * as child_process from "child_process";

export type command =
    "alias" |
    "baseboard" |
    "bios" |
    "bootconfig" |
    "cdrom" |
    "computersystem" |
    "cpu" |
    "csproduct" |
    "datafile" |
    "dcomapp" |
    "desktop" |
    "desktopmonitor" |
    "devicememoryaddress" |
    "diskdrive" |
    "diskquota" |
    "dmachannel" |
    "environment" |
    "fsdir" |
    "group" |
    "idecontroller" |
    "irq" |
    "job" |
    "loadorder" |
    "logicaldisk" |
    "logon" |
    "memcache" |
    "memorychip" |
    "memphysical" |
    "netclient" |
    "netlogin" |
    "netprotocol" |
    "netuse" |
    "nic" |
    "nicconfig" |
    "ntdomain" |
    "ntevent" |
    "nteventlog" |
    "onboarddevice" |
    "os" |
    "pagefile" |
    "pagefileset" |
    "partition" |
    "port" |
    "portconnector" |
    "printer" |
    "printerconfig" |
    "printjob" |
    "process" |
    "product" |
    "qfe" |
    "quotasetting" |
    "rdaccount" |
    "rdnic" |
    "rdpermissions" |
    "rdtoggle" |
    "recoveros" |
    "registry" |
    "scsicontroller" |
    "server" |
    "service" |
    "shadowcopy" |
    "shadowstorage" |
    "share" |
    "softwareelement" |
    "softwarefeature" |
    "sounddev" |
    "startup" |
    "sysaccount" |
    "sysdriver" |
    "systemenclosure" |
    "systemslot" |
    "tapedrive" |
    "temperature" |
    "timezone" |
    "ups" |
    "useraccount" |
    "voltage" |
    "volume" |
    "volumequotasetting" |
    "volumeuserquota" |
    "wmiset";

const iteratorToArray = <T>(iterator: () => T): T[] =>
{
    const result: T[] = [];
    let current: T;
    while(current = iterator())
    {
        result.push(current);
    }
    return result;
}
const regExpExecToArray = (regexp: RegExp, text: string): RegExpExecArray[] => iteratorToArray(() => regexp.exec(text));

export const get = (command: command) => new Promise<{ [key: string]: string }[]>
(
    (resolve, reject) => child_process.exec
    (
        `wmic ${command}`,
        (error, stdout) =>
        {
            if (undefined !== error && null !== error)
            {
                reject(error);
            }
            else
            {
                const lines = stdout.replace(/\r\r\n/gm, "\r\n").split("\r\n").filter(i => 0 < i.trim().length);
                const headers = regExpExecToArray(/\S+\s+/gm, lines[0]).map(i => i[0]);
                const body = lines.slice(1);
                resolve
                (
                    body.map
                    (
                        line =>
                        {
                            const result: { [key: string]: string } = { };
                            let i = 0;
                            headers.map
                            (
                                key =>
                                {
                                    result[key.trim()] = line.substr(i, key.length).trim();
                                    i += key.length;
                                }
                            );
                            return result;
                        }
                    )
                );
            }
        }
    )
);

export default get;
