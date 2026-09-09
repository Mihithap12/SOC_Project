package com.farmercustomer.orderservice.config;

import org.camunda.bpm.engine.RepositoryService;
import org.camunda.bpm.engine.repository.ProcessDefinition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CamundaAutoDeploymentRunner implements CommandLineRunner {

    @Autowired(required = false)
    private RepositoryService repositoryService;

    @Override
    public void run(String... args) throws Exception {
        if (repositoryService == null) {
            return;
        }
        try {
            List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery().list();
            System.out.println(">>> [Camunda Engine Status] Total Deployed Process Definitions: " + list.size());
            for (ProcessDefinition pd : list) {
                System.out.println(">>> [Camunda Process] Key: " + pd.getKey() + " | Name: " + pd.getName() + " | Version: " + pd.getVersion());
            }
        } catch (Exception e) {
            System.err.println(">>> [Camunda Status Error] " + e.getMessage());
        }
    }
}
