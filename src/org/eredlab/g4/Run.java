package org.eredlab.g4;

import org.eredlab.g4.rif.server.G4Server;

/**
 * 系统启动
 * @author XiongChun
 * @since 2009-01-13
 */
public class Run {
    public static void main(String[] args) {
        G4Server server = new G4Server(
                "E:\\workspace-old\\eredg4v1031\\WebRoot",
                "/eredg4v1031",
                8886
                );
        server.stop();
        try {
            server.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
