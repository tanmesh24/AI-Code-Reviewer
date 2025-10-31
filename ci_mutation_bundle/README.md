# CI + Mutation Testing Bundle

This ZIP contains two sample projects (Java and Python) preconfigured for:
- GitHub Actions CI (build, unit tests, coverage)
- Mutation testing (PIT for Java, MutPy for Python)

## Contents
- java-project/
  - pom.xml
  - src/main/java/com/example/App.java
  - src/test/java/com/example/AppTest.java
  - .github/workflows/ci.yml  (Java CI + PIT run)

- python-project/
  - app/calculator.py
  - tests/test_calculator.py
  - requirements.txt
  - .github/workflows/ci.yml  (Python CI + MutPy run)

## How to use
1. Unzip the bundle.
2. For Java:
   - Run tests locally:
     mvn -B clean test
   - Generate coverage:
     mvn jacoco:report
   - Run PIT mutation testing:
     mvn -DskipTests=false org.pitest:pitest-maven:mutationCoverage

3. For Python:
   - Install dependencies:
     python -m pip install -r requirements.txt
   - Run tests & coverage:
     coverage run -m pytest
     coverage html
   - Run MutPy:
     mut.py --target app/calculator.py --unit-test tests/test_calculator.py --report-html mutpy_report --verbosity 2

## What to submit
- Push the project folder you used (java-project or python-project) to your GitHub repo.
- Attach the generated reports (coverage HTML and mutation reports).
- A short README describing initial and final mutation scores and CI run screenshots.

Good luck in the lab!
